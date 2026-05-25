"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NiimbotUniAppBleClient = void 0;
const events_1 = require("../events");
const _1 = require(".");
const packets_1 = require("../packets");
const utils_1 = require("../utils");
const bluetooth_impl_1 = require("./bluetooth_impl");
/**
 * Uses [UniApp Bluetooth Low Energy API](https://uniapp.dcloud.net.cn/api/system/ble.html)
 *
 * @category Client
 */
class NiimbotUniAppBleClient extends _1.NiimbotAbstractClient {
    constructor() {
        super(...arguments);
        this.mtu = 20;
        this.onConnectionStateChange = (res) => {
            if (res.deviceId === this.deviceId && !res.connected) {
                this.onBleDisconnect();
            }
        };
        this.onCharacteristicValueChange = (res) => {
            if (res.deviceId === this.deviceId) {
                this.processRawPacket(new Uint8Array(res.value));
            }
        };
    }
    async connect(options) {
        await this.disconnect();
        await new Promise((resolve, reject) => {
            uni.openBluetoothAdapter({
                success: () => resolve(),
                fail: (err) => reject(new Error(`openBluetoothAdapter failed: ${err.errMsg}`)),
            });
        });
        let deviceId;
        let deviceName;
        if (options?.deviceId !== undefined) {
            deviceId = options.deviceId;
            deviceName = options.deviceName ?? options.deviceId;
        }
        else {
            const device = await this.scanForDevice(options?.scanTimeoutMs ?? 15_000);
            deviceId = device.deviceId;
            deviceName = device.name ?? deviceId;
        }
        await new Promise((resolve, reject) => {
            uni.createBLEConnection({
                deviceId,
                success: () => resolve(),
                fail: (err) => reject(new Error(`createBLEConnection failed: ${err.errMsg}`)),
            });
        });
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        uni.onBLEConnectionStateChange(this.onConnectionStateChange);
        // Android: try to negotiate a larger MTU
        try {
            const mtuRes = await new Promise((resolve, reject) => {
                uni.setBLEMTU({
                    deviceId,
                    mtu: 512,
                    success: (res) => resolve(res),
                    fail: () => reject(),
                });
            });
            this.mtu = mtuRes.mtu - 3; // ATT overhead
        }
        catch {
            // iOS or unsupported — keep default 20
        }
        const { serviceId, characteristicId } = await this.findSuitableCharacteristic(deviceId);
        this.serviceId = serviceId;
        this.characteristicId = characteristicId;
        await new Promise((resolve, reject) => {
            uni.notifyBLECharacteristicValueChange({
                deviceId,
                serviceId,
                characteristicId,
                state: true,
                success: () => resolve(),
                fail: (err) => reject(new Error(`notifyBLECharacteristicValueChange failed: ${err.errMsg}`)),
            });
        });
        uni.onBLECharacteristicValueChange(this.onCharacteristicValueChange);
        try {
            await this.initialNegotiate();
            await this.fetchPrinterInfo();
        }
        catch (e) {
            console.error("Unable to fetch printer info.");
            console.error(e);
        }
        const result = {
            deviceName: this.deviceName,
            result: this.info.connectResult ?? packets_1.ConnectResult.FirmwareErrors,
        };
        this.emit("connect", new events_1.ConnectEvent(result));
        return result;
    }
    scanForDevice(timeoutMs) {
        return new Promise((resolve, reject) => {
            let settled = false;
            const timer = setTimeout(() => {
                if (!settled) {
                    settled = true;
                    uni.stopBluetoothDevicesDiscovery();
                    uni.offBluetoothDeviceFound();
                    reject(new Error("Bluetooth scan timeout"));
                }
            }, timeoutMs);
            uni.onBluetoothDeviceFound((res) => {
                for (const device of res.devices) {
                    const name = device.name || device.localName || "";
                    if (!name)
                        continue;
                    const serviceUuids = (device.advertisServiceUUIDs ?? []).map((u) => u.toLowerCase());
                    const matchesService = bluetooth_impl_1.BleDefaultConfiguration.SERVICES.some((s) => serviceUuids.includes(s));
                    if (matchesService || this.isNiimbotDeviceName(name)) {
                        if (!settled) {
                            settled = true;
                            clearTimeout(timer);
                            uni.stopBluetoothDevicesDiscovery();
                            uni.offBluetoothDeviceFound();
                            resolve({ deviceId: device.deviceId, name });
                        }
                        return;
                    }
                }
            });
            uni.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: false,
                success: () => { },
                fail: (err) => {
                    if (!settled) {
                        settled = true;
                        clearTimeout(timer);
                        uni.offBluetoothDeviceFound();
                        reject(new Error(`startBluetoothDevicesDiscovery failed: ${err.errMsg}`));
                    }
                },
            });
        });
    }
    isNiimbotDeviceName(name) {
        const prefixes = ["D", "B", "A", "T", "Z", "N", "S", "P", "E", "H", "C"];
        return prefixes.some((p) => name.startsWith(p));
    }
    async findSuitableCharacteristic(deviceId) {
        const servicesRes = await new Promise((resolve, reject) => {
            uni.getBLEDeviceServices({
                deviceId,
                success: (res) => resolve(res),
                fail: (err) => reject(new Error(`getBLEDeviceServices failed: ${err.errMsg}`)),
            });
        });
        for (const service of servicesRes.services) {
            if (service.uuid.length < 5)
                continue;
            const charsRes = await new Promise((resolve, reject) => {
                uni.getBLEDeviceCharacteristics({
                    deviceId,
                    serviceId: service.uuid,
                    success: (res) => resolve(res),
                    fail: (err) => reject(new Error(`getBLEDeviceCharacteristics failed: ${err.errMsg}`)),
                });
            });
            for (const ch of charsRes.characteristics) {
                if (ch.properties.notify && ch.properties.writeNoResponse) {
                    return { serviceId: service.uuid, characteristicId: ch.uuid };
                }
            }
        }
        throw new Error("No suitable BLE characteristic found");
    }
    onBleDisconnect() {
        uni.offBLEConnectionStateChange(this.onConnectionStateChange);
        uni.offBLECharacteristicValueChange(this.onCharacteristicValueChange);
        this.deviceId = undefined;
        this.serviceId = undefined;
        this.characteristicId = undefined;
        this.deviceName = undefined;
        this.info = {};
        this.emit("disconnect", new events_1.DisconnectEvent());
    }
    isConnected() {
        return this.deviceId !== undefined;
    }
    async disconnect() {
        this.stopHeartbeat();
        if (this.deviceId !== undefined) {
            try {
                await new Promise((resolve) => {
                    uni.closeBLEConnection({
                        deviceId: this.deviceId,
                        success: () => resolve(),
                        fail: () => resolve(),
                    });
                });
            }
            catch {
                // ignore
            }
        }
        uni.offBLEConnectionStateChange(this.onConnectionStateChange);
        uni.offBLECharacteristicValueChange(this.onCharacteristicValueChange);
        this.deviceId = undefined;
        this.serviceId = undefined;
        this.characteristicId = undefined;
        this.deviceName = undefined;
        this.info = {};
    }
    async sendRaw(data, force) {
        const send = async () => {
            if (!this.isConnected()) {
                throw new Error("Channel is closed");
            }
            await utils_1.Utils.sleep(this.packetIntervalMs);
            for (let offset = 0; offset < data.length; offset += this.mtu) {
                const chunk = data.slice(offset, offset + this.mtu);
                await new Promise((resolve, reject) => {
                    uni.writeBLECharacteristicValue({
                        deviceId: this.deviceId,
                        serviceId: this.serviceId,
                        characteristicId: this.characteristicId,
                        value: chunk.buffer,
                        writeType: "writeNoResponse",
                        success: () => resolve(),
                        fail: (err) => reject(new Error(`writeBLECharacteristicValue failed: ${err.errMsg}`)),
                    });
                });
            }
            this.emit("rawpacketsent", new events_1.RawPacketSentEvent(data));
        };
        if (force) {
            await send();
        }
        else {
            await this.mutex.runExclusive(send);
        }
    }
}
exports.NiimbotUniAppBleClient = NiimbotUniAppBleClient;
