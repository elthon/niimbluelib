"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NIIMBOT_CLIENT_DEFAULTS = exports.NiimbotUniAppBleClient = exports.NiimbotSerialClient = exports.NiimbotCapacitorBleClient = exports.NiimbotBluetoothClient = exports.NiimbotAbstractClient = exports.instantiateClient = void 0;
const abstract_client_1 = require("./abstract_client");
Object.defineProperty(exports, "NiimbotAbstractClient", { enumerable: true, get: function () { return abstract_client_1.NiimbotAbstractClient; } });
Object.defineProperty(exports, "NIIMBOT_CLIENT_DEFAULTS", { enumerable: true, get: function () { return abstract_client_1.NIIMBOT_CLIENT_DEFAULTS; } });
const bluetooth_impl_1 = require("./bluetooth_impl");
Object.defineProperty(exports, "NiimbotBluetoothClient", { enumerable: true, get: function () { return bluetooth_impl_1.NiimbotBluetoothClient; } });
const capacitor_ble_impl_1 = require("./capacitor_ble_impl");
Object.defineProperty(exports, "NiimbotCapacitorBleClient", { enumerable: true, get: function () { return capacitor_ble_impl_1.NiimbotCapacitorBleClient; } });
const serial_impl_1 = require("./serial_impl");
Object.defineProperty(exports, "NiimbotSerialClient", { enumerable: true, get: function () { return serial_impl_1.NiimbotSerialClient; } });
const uniapp_ble_impl_1 = require("./uniapp_ble_impl");
Object.defineProperty(exports, "NiimbotUniAppBleClient", { enumerable: true, get: function () { return uniapp_ble_impl_1.NiimbotUniAppBleClient; } });
/** Create new client instance */
const instantiateClient = (t) => {
    if (t === "bluetooth") {
        return new bluetooth_impl_1.NiimbotBluetoothClient();
    }
    else if (t === "capacitor-ble") {
        return new capacitor_ble_impl_1.NiimbotCapacitorBleClient();
    }
    else if (t === "serial") {
        return new serial_impl_1.NiimbotSerialClient();
    }
    else if (t === "uniapp-ble") {
        return new uniapp_ble_impl_1.NiimbotUniAppBleClient();
    }
    throw new Error("Invalid client type");
};
exports.instantiateClient = instantiateClient;
