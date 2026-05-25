/**
 * Minimal type declarations for UniApp Bluetooth Low Energy APIs.
 *
 * These cover only the subset used by {@link NiimbotUniAppBleClient}.
 * In a real UniApp project the full `@dcloudio/types` package provides these globally.
 */

interface UniAppBLECallbackResult {
  errMsg: string;
  errCode?: number;
}

interface UniAppBLEDevice {
  deviceId: string;
  name?: string;
  localName?: string;
  advertisServiceUUIDs?: string[];
  RSSI?: number;
}

interface UniAppBLEService {
  uuid: string;
  isPrimary: boolean;
}

interface UniAppBLECharacteristic {
  uuid: string;
  properties: {
    read: boolean;
    write: boolean;
    notify: boolean;
    indicate: boolean;
    writeNoResponse: boolean;
    writeDefault: boolean;
  };
}

interface UniAppBLEConnectionStateChange {
  deviceId: string;
  connected: boolean;
}

interface UniAppBLECharacteristicValueChange {
  deviceId: string;
  serviceId: string;
  characteristicId: string;
  value: ArrayBuffer;
}

interface UniAppBLEApi {
  openBluetoothAdapter(options: {
    success?: () => void;
    fail?: (err: UniAppBLECallbackResult) => void;
    complete?: () => void;
  }): void;

  startBluetoothDevicesDiscovery(options: {
    services?: string[];
    allowDuplicatesKey?: boolean;
    success?: () => void;
    fail?: (err: UniAppBLECallbackResult) => void;
    complete?: () => void;
  }): void;

  stopBluetoothDevicesDiscovery(options?: {
    success?: () => void;
    fail?: (err: UniAppBLECallbackResult) => void;
  }): void;

  onBluetoothDeviceFound(callback: (res: { devices: UniAppBLEDevice[] }) => void): void;
  offBluetoothDeviceFound(callback?: () => void): void;

  createBLEConnection(options: {
    deviceId: string;
    timeout?: number;
    success?: () => void;
    fail?: (err: UniAppBLECallbackResult) => void;
    complete?: () => void;
  }): void;

  closeBLEConnection(options: {
    deviceId: string;
    success?: () => void;
    fail?: (err: UniAppBLECallbackResult) => void;
    complete?: () => void;
  }): void;

  getBLEDeviceServices(options: {
    deviceId: string;
    success?: (res: { services: UniAppBLEService[] }) => void;
    fail?: (err: UniAppBLECallbackResult) => void;
  }): void;

  getBLEDeviceCharacteristics(options: {
    deviceId: string;
    serviceId: string;
    success?: (res: { characteristics: UniAppBLECharacteristic[] }) => void;
    fail?: (err: UniAppBLECallbackResult) => void;
  }): void;

  notifyBLECharacteristicValueChange(options: {
    deviceId: string;
    serviceId: string;
    characteristicId: string;
    state: boolean;
    type?: string;
    success?: () => void;
    fail?: (err: UniAppBLECallbackResult) => void;
  }): void;

  onBLECharacteristicValueChange(callback: (res: UniAppBLECharacteristicValueChange) => void): void;
  offBLECharacteristicValueChange(callback?: (res: UniAppBLECharacteristicValueChange) => void): void;

  onBLEConnectionStateChange(callback: (res: UniAppBLEConnectionStateChange) => void): void;
  offBLEConnectionStateChange(callback?: (res: UniAppBLEConnectionStateChange) => void): void;

  writeBLECharacteristicValue(options: {
    deviceId: string;
    serviceId: string;
    characteristicId: string;
    value: ArrayBuffer;
    writeType?: "write" | "writeNoResponse";
    success?: () => void;
    fail?: (err: UniAppBLECallbackResult) => void;
  }): void;

  setBLEMTU(options: {
    deviceId: string;
    mtu: number;
    success?: (res: { mtu: number }) => void;
    fail?: (err: UniAppBLECallbackResult) => void;
  }): void;
}

declare const uni: UniAppBLEApi;
