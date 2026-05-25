import { ConnectEvent, DisconnectEvent, RawPacketSentEvent } from "../events";
import { ConnectionInfo, NiimbotAbstractClient } from ".";
import { ConnectResult } from "../packets";
import { Utils } from "../utils";
import { BleDefaultConfiguration } from "./bluetooth_impl";

/**
 * @category Client
 */
export interface NiimbotUniAppBleClientConnectOptions {
  /**
   * Skip scanning and connect to a known device ID directly.
   *
   * On **Android** this is the BLE MAC address.
   *
   * On **iOS** it is an identifier.
   */
  deviceId?: string;

  /**
   * Device name (used for {@link ConnectionInfo.deviceName}).
   * Only meaningful when {@link deviceId} is provided.
   */
  deviceName?: string;

  /** Scan timeout in milliseconds (default: 15000). */
  scanTimeoutMs?: number;
}

/**
 * Uses [UniApp Bluetooth Low Energy API](https://uniapp.dcloud.net.cn/api/system/ble.html)
 *
 * @category Client
 */
export class NiimbotUniAppBleClient extends NiimbotAbstractClient {
  private deviceId?: string;
  private serviceId?: string;
  private characteristicId?: string;
  private writeType: string = "writeNoResponse";
  private deviceName?: string;
  public mtu: number = 20;

  private readonly onConnectionStateChange = (res: UniAppBLEConnectionStateChange) => {
    if (res.deviceId === this.deviceId && !res.connected) {
      this.onBleDisconnect();
    }
  };

  private readonly onCharacteristicValueChange = (res: UniAppBLECharacteristicValueChange) => {
    if (res.deviceId === this.deviceId) {
      this.processRawPacket(new Uint8Array(res.value));
    }
  };

  public async connect(options?: NiimbotUniAppBleClientConnectOptions): Promise<ConnectionInfo> {
    await this.disconnect();

    await new Promise<void>((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: () => resolve(),
        fail: (err) => reject(new Error(`openBluetoothAdapter failed: ${err.errMsg}`)),
      });
    });

    let deviceId: string;
    let deviceName: string | undefined;

    if (options?.deviceId !== undefined) {
      deviceId = options.deviceId;
      deviceName = options.deviceName ?? options.deviceId;
    } else {
      const device = await this.scanForDevice(options?.scanTimeoutMs ?? 15_000);
      deviceId = device.deviceId;
      deviceName = device.name ?? deviceId;
    }

    await new Promise<void>((resolve, reject) => {
      uni.createBLEConnection({
        deviceId,
        success: () => resolve(),
        fail: (err) => reject(new Error(`createBLEConnection failed: ${err.errMsg}`)),
      });
    });

    this.deviceId = deviceId;
    this.deviceName = deviceName;

    uni.onBLEConnectionStateChange(this.onConnectionStateChange);

    // Wait for BLE connection to stabilize before MTU negotiation
    await Utils.sleep(500);

    // Android: try to negotiate a larger MTU (retry up to 3 times)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const mtuRes = await new Promise<{ mtu: number }>((resolve, reject) => {
          uni.setBLEMTU({
            deviceId,
            mtu: 512,
            success: (res: any) => resolve(res),
            fail: (err: any) => reject(err),
          });
        });
        const negotiated = (mtuRes.mtu ?? 0) - 3; // ATT overhead
        console.log("[niimblue] MTU negotiated:", mtuRes.mtu, "-> payload:", negotiated);
        if (negotiated >= 20) {
          this.mtu = negotiated;
        }
        break;
      } catch {
        if (attempt < 3) {
          await Utils.sleep(300);
        } else {
          console.log("[niimblue] MTU negotiation failed after 3 attempts, using default:", this.mtu);
        }
      }
    }

    const { serviceId, characteristicId, writeType } = await this.findSuitableCharacteristic(deviceId);
    this.serviceId = serviceId;
    this.characteristicId = characteristicId;
    this.writeType = writeType;

    await new Promise<void>((resolve, reject) => {
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

    // Give the BLE stack a moment to stabilize before first protocol command
    await Utils.sleep(200);

    // Use a longer timeout for BLE (default 1s may be too short)
    this.abstraction.setPacketTimeout(3_000);

    // Retry initial negotiate up to 3 times (first command on BLE can be flaky)
    let negotiateOk = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log("[niimblue] initialNegotiate attempt", attempt);
        await this.initialNegotiate();
        negotiateOk = true;
        break;
      } catch (e) {
        console.warn(`[niimblue] initialNegotiate attempt ${attempt} failed:`, e);
        if (attempt < 3) await Utils.sleep(300);
      }
    }

    if (negotiateOk) {
      try {
        await this.fetchPrinterInfo();
      } catch (e) {
        console.error("[niimblue] fetchPrinterInfo failed:", e);
      }
    } else {
      console.error("[niimblue] All initialNegotiate attempts failed, skipping fetchPrinterInfo");
    }

    // Restore default timeout for normal operations
    this.abstraction.setDefaultPacketTimeout();

    const result: ConnectionInfo = {
      deviceName: this.deviceName,
      result: this.info.connectResult ?? ConnectResult.FirmwareErrors,
    };

    this.emit("connect", new ConnectEvent(result));
    return result;
  }

  private scanForDevice(timeoutMs: number): Promise<{ deviceId: string; name?: string }> {
    return new Promise((resolve, reject) => {
      let settled = false;

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          uni.stopBluetoothDevicesDiscovery();
          typeof uni.offBluetoothDeviceFound === "function" && uni.offBluetoothDeviceFound();
          reject(new Error("Bluetooth scan timeout"));
        }
      }, timeoutMs);

      uni.onBluetoothDeviceFound((res) => {
        for (const device of res.devices) {
          const name = device.name || device.localName || "";
          if (!name) continue;

          const serviceUuids = (device.advertisServiceUUIDs ?? []).map((u: string) => u.toLowerCase());
          const matchesService = BleDefaultConfiguration.SERVICES.some((s) => serviceUuids.includes(s));

          if (matchesService || this.isNiimbotDeviceName(name)) {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              uni.stopBluetoothDevicesDiscovery();
              typeof uni.offBluetoothDeviceFound === "function" && uni.offBluetoothDeviceFound();
              resolve({ deviceId: device.deviceId, name });
            }
            return;
          }
        }
      });

      uni.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: () => {},
        fail: (err) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            typeof uni.offBluetoothDeviceFound === "function" && uni.offBluetoothDeviceFound();
            reject(new Error(`startBluetoothDevicesDiscovery failed: ${err.errMsg}`));
          }
        },
      });
    });
  }

  private isNiimbotDeviceName(name: string): boolean {
    const prefixes = ["D", "B", "A", "T", "Z", "N", "S", "P", "E", "H", "C"];
    return prefixes.some((p) => name.startsWith(p));
  }

  private async findSuitableCharacteristic(
    deviceId: string
  ): Promise<{ serviceId: string; characteristicId: string; writeType: string }> {
    const servicesRes = await new Promise<{ services: { uuid: string }[] }>((resolve, reject) => {
      uni.getBLEDeviceServices({
        deviceId,
        success: (res: any) => resolve(res),
        fail: (err) => reject(new Error(`getBLEDeviceServices failed: ${err.errMsg}`)),
      });
    });

    console.log("[niimblue] discovered services:", servicesRes.services.map((s: any) => s.uuid));

    for (const service of servicesRes.services) {
      if (service.uuid.length < 5) continue;

      const charsRes = await new Promise<{
        characteristics: { uuid: string; properties: Record<string, boolean> }[];
      }>((resolve, reject) => {
        uni.getBLEDeviceCharacteristics({
          deviceId,
          serviceId: service.uuid,
          success: (res: any) => resolve(res),
          fail: (err) => reject(new Error(`getBLEDeviceCharacteristics failed: ${err.errMsg}`)),
        });
      });

      for (const ch of charsRes.characteristics) {
        const p = ch.properties;
        console.log("[niimblue] char:", ch.uuid, "props:", JSON.stringify(p));

        const canNotify = p.notify || p.indicate;
        const canWrite = p.writeNoResponse || p.writeDefault || p.write;

        if (canNotify && canWrite) {
          const writeType = p.writeNoResponse ? "writeNoResponse" : "write";
          console.log("[niimblue] selected:", service.uuid, ch.uuid, "writeType:", writeType);
          return { serviceId: service.uuid, characteristicId: ch.uuid, writeType };
        }
      }
    }
    throw new Error("No suitable BLE characteristic found");
  }

  private onBleDisconnect() {
    typeof uni.offBLEConnectionStateChange === "function" && uni.offBLEConnectionStateChange(this.onConnectionStateChange);
    typeof uni.offBLECharacteristicValueChange === "function" && uni.offBLECharacteristicValueChange(this.onCharacteristicValueChange);
    this.deviceId = undefined;
    this.serviceId = undefined;
    this.characteristicId = undefined;
    this.writeType = "writeNoResponse";
    this.deviceName = undefined;
    this.info = {};
    this.emit("disconnect", new DisconnectEvent());
  }

  public isConnected(): boolean {
    return this.deviceId !== undefined;
  }

  public async disconnect(): Promise<void> {
    this.stopHeartbeat();
    if (this.deviceId !== undefined) {
      try {
        await new Promise<void>((resolve) => {
          uni.closeBLEConnection({
            deviceId: this.deviceId!,
            success: () => resolve(),
            fail: () => resolve(),
          });
        });
      } catch {
        // ignore
      }
    }
    typeof uni.offBLEConnectionStateChange === "function" && uni.offBLEConnectionStateChange(this.onConnectionStateChange);
    typeof uni.offBLECharacteristicValueChange === "function" && uni.offBLECharacteristicValueChange(this.onCharacteristicValueChange);
    this.deviceId = undefined;
    this.serviceId = undefined;
    this.characteristicId = undefined;
    this.writeType = "writeNoResponse";
    this.deviceName = undefined;
    this.info = {};
  }

  public async sendRaw(data: Uint8Array, force?: boolean): Promise<void> {
    const send = async () => {
      if (!this.isConnected()) {
        throw new Error("Channel is closed");
      }
      await Utils.sleep(this.packetIntervalMs);

      for (let offset = 0; offset < data.length; offset += this.mtu) {
        const end = Math.min(offset + this.mtu, data.length);
        // Build a brand-new ArrayBuffer (some UniApp runtimes reject sliced/shared buffers)
        const ab = new ArrayBuffer(end - offset);
        new Uint8Array(ab).set(data.subarray(offset, end));

        await new Promise<void>((resolve, reject) => {
          uni.writeBLECharacteristicValue({
            deviceId: this.deviceId!,
            serviceId: this.serviceId!,
            characteristicId: this.characteristicId!,
            value: ab,
            writeType: this.writeType as any,
            success: () => resolve(),
            fail: (err) => reject(new Error(`writeBLECharacteristicValue failed: ${err.errMsg}`)),
          });
        });
      }

      this.emit("rawpacketsent", new RawPacketSentEvent(data));
    };

    if (force) {
      await send();
    } else {
      await this.mutex.runExclusive(send);
    }
  }
}
