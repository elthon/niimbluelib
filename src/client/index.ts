import { NiimbotAbstractClient, ConnectionInfo, NIIMBOT_CLIENT_DEFAULTS } from "./abstract_client";
import { NiimbotBluetoothClient } from "./bluetooth_impl";
import { NiimbotCapacitorBleClient, NiimbotCapacitorBleClientConnectOptions } from "./capacitor_ble_impl";
import { NiimbotSerialClient } from "./serial_impl";
import { NiimbotUniAppBleClient, NiimbotUniAppBleClientConnectOptions } from "./uniapp_ble_impl";

/** Client type for {@link instantiateClient} */
export type NiimbotClientType = "bluetooth" | "serial" | "capacitor-ble" | "uniapp-ble";

/** Create new client instance */
export const instantiateClient = (t: NiimbotClientType): NiimbotAbstractClient => {
  if (t === "bluetooth") {
    return new NiimbotBluetoothClient();
  } else if (t === "capacitor-ble") {
    return new NiimbotCapacitorBleClient();
  } else if (t === "serial") {
    return new NiimbotSerialClient();
  } else if (t === "uniapp-ble") {
    return new NiimbotUniAppBleClient();
  }
  throw new Error("Invalid client type");
};

export {
  NiimbotAbstractClient,
  ConnectionInfo,
  NiimbotBluetoothClient,
  NiimbotCapacitorBleClient,
  NiimbotCapacitorBleClientConnectOptions,
  NiimbotSerialClient,
  NiimbotUniAppBleClient,
  NiimbotUniAppBleClientConnectOptions,
  NIIMBOT_CLIENT_DEFAULTS,
};
