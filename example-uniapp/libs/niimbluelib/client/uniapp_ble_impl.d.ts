import { ConnectionInfo, NiimbotAbstractClient } from ".";
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
export declare class NiimbotUniAppBleClient extends NiimbotAbstractClient {
    private deviceId?;
    private serviceId?;
    private characteristicId?;
    private deviceName?;
    private mtu;
    private readonly onConnectionStateChange;
    private readonly onCharacteristicValueChange;
    connect(options?: NiimbotUniAppBleClientConnectOptions): Promise<ConnectionInfo>;
    private scanForDevice;
    private isNiimbotDeviceName;
    private findSuitableCharacteristic;
    private onBleDisconnect;
    isConnected(): boolean;
    disconnect(): Promise<void>;
    sendRaw(data: Uint8Array, force?: boolean): Promise<void>;
}
