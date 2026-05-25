var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// node_modules/crc-32/crc32.js
var require_crc32 = __commonJS({
  "node_modules/crc-32/crc32.js"(exports) {
    var CRC323;
    (function(factory) {
      if (typeof DO_NOT_EXPORT_CRC === "undefined") {
        if ("object" === typeof exports) {
          factory(exports);
        } else if ("function" === typeof define && define.amd) {
          define(function() {
            var module2 = {};
            factory(module2);
            return module2;
          });
        } else {
          factory(CRC323 = {});
        }
      } else {
        factory(CRC323 = {});
      }
    })(function(CRC324) {
      CRC324.version = "1.2.2";
      function signed_crc_table() {
        var c = 0, table = new Array(256);
        for (var n = 0; n != 256; ++n) {
          c = n;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          table[n] = c;
        }
        return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
      }
      var T0 = signed_crc_table();
      function slice_by_16_tables(T) {
        var c = 0, v = 0, n = 0, table = typeof Int32Array !== "undefined" ? new Int32Array(4096) : new Array(4096);
        for (n = 0; n != 256; ++n) table[n] = T[n];
        for (n = 0; n != 256; ++n) {
          v = T[n];
          for (c = 256 + n; c < 4096; c += 256) v = table[c] = v >>> 8 ^ T[v & 255];
        }
        var out = [];
        for (n = 1; n != 16; ++n) out[n - 1] = typeof Int32Array !== "undefined" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
        return out;
      }
      var TT = slice_by_16_tables(T0);
      var T1 = TT[0], T2 = TT[1], T3 = TT[2], T4 = TT[3], T5 = TT[4];
      var T6 = TT[5], T7 = TT[6], T8 = TT[7], T9 = TT[8], Ta = TT[9];
      var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
      function crc32_bstr(bstr, seed) {
        var C = seed ^ -1;
        for (var i = 0, L = bstr.length; i < L; ) C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 255];
        return ~C;
      }
      function crc32_buf(B, seed) {
        var C = seed ^ -1, L = B.length - 15, i = 0;
        for (; i < L; ) C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
        L += 15;
        while (i < L) C = C >>> 8 ^ T0[(C ^ B[i++]) & 255];
        return ~C;
      }
      function crc32_str(str, seed) {
        var C = seed ^ -1;
        for (var i = 0, L = str.length, c = 0, d = 0; i < L; ) {
          c = str.charCodeAt(i++);
          if (c < 128) {
            C = C >>> 8 ^ T0[(C ^ c) & 255];
          } else if (c < 2048) {
            C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
          } else if (c >= 55296 && c < 57344) {
            c = (c & 1023) + 64;
            d = str.charCodeAt(i++) & 1023;
            C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 255];
          } else {
            C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
          }
        }
        return ~C;
      }
      CRC324.table = T0;
      CRC324.bstr = crc32_bstr;
      CRC324.buf = crc32_buf;
      CRC324.str = crc32_str;
    });
  }
});

// node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// node_modules/async-mutex/index.mjs
var E_TIMEOUT = new Error("timeout while waiting for mutex to become available");
var E_ALREADY_LOCKED = new Error("mutex already locked");
var E_CANCELED = new Error("request for lock canceled");
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Semaphore = class {
  constructor(_value, _cancelError = E_CANCELED) {
    this._value = _value;
    this._cancelError = _cancelError;
    this._queue = [];
    this._weightedWaiters = [];
  }
  acquire(weight = 1, priority = 0) {
    if (weight <= 0)
      throw new Error(`invalid weight ${weight}: must be positive`);
    return new Promise((resolve, reject) => {
      const task = { resolve, reject, weight, priority };
      const i = findIndexFromEnd(this._queue, (other) => priority <= other.priority);
      if (i === -1 && weight <= this._value) {
        this._dispatchItem(task);
      } else {
        this._queue.splice(i + 1, 0, task);
      }
    });
  }
  runExclusive(callback_1) {
    return __awaiter$2(this, arguments, void 0, function* (callback, weight = 1, priority = 0) {
      const [value, release] = yield this.acquire(weight, priority);
      try {
        return yield callback(value);
      } finally {
        release();
      }
    });
  }
  waitForUnlock(weight = 1, priority = 0) {
    if (weight <= 0)
      throw new Error(`invalid weight ${weight}: must be positive`);
    if (this._couldLockImmediately(weight, priority)) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        if (!this._weightedWaiters[weight - 1])
          this._weightedWaiters[weight - 1] = [];
        insertSorted(this._weightedWaiters[weight - 1], { resolve, priority });
      });
    }
  }
  isLocked() {
    return this._value <= 0;
  }
  getValue() {
    return this._value;
  }
  setValue(value) {
    this._value = value;
    this._dispatchQueue();
  }
  release(weight = 1) {
    if (weight <= 0)
      throw new Error(`invalid weight ${weight}: must be positive`);
    this._value += weight;
    this._dispatchQueue();
  }
  cancel() {
    this._queue.forEach((entry) => entry.reject(this._cancelError));
    this._queue = [];
  }
  _dispatchQueue() {
    this._drainUnlockWaiters();
    while (this._queue.length > 0 && this._queue[0].weight <= this._value) {
      this._dispatchItem(this._queue.shift());
      this._drainUnlockWaiters();
    }
  }
  _dispatchItem(item) {
    const previousValue = this._value;
    this._value -= item.weight;
    item.resolve([previousValue, this._newReleaser(item.weight)]);
  }
  _newReleaser(weight) {
    let called = false;
    return () => {
      if (called)
        return;
      called = true;
      this.release(weight);
    };
  }
  _drainUnlockWaiters() {
    if (this._queue.length === 0) {
      for (let weight = this._value; weight > 0; weight--) {
        const waiters = this._weightedWaiters[weight - 1];
        if (!waiters)
          continue;
        waiters.forEach((waiter) => waiter.resolve());
        this._weightedWaiters[weight - 1] = [];
      }
    } else {
      const queuedPriority = this._queue[0].priority;
      for (let weight = this._value; weight > 0; weight--) {
        const waiters = this._weightedWaiters[weight - 1];
        if (!waiters)
          continue;
        const i = waiters.findIndex((waiter) => waiter.priority <= queuedPriority);
        (i === -1 ? waiters : waiters.splice(0, i)).forEach(((waiter) => waiter.resolve()));
      }
    }
  }
  _couldLockImmediately(weight, priority) {
    return (this._queue.length === 0 || this._queue[0].priority < priority) && weight <= this._value;
  }
};
function insertSorted(a, v) {
  const i = findIndexFromEnd(a, (other) => v.priority <= other.priority);
  a.splice(i + 1, 0, v);
}
function findIndexFromEnd(a, predicate) {
  for (let i = a.length - 1; i >= 0; i--) {
    if (predicate(a[i])) {
      return i;
    }
  }
  return -1;
}
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Mutex = class {
  constructor(cancelError) {
    this._semaphore = new Semaphore(1, cancelError);
  }
  acquire() {
    return __awaiter$1(this, arguments, void 0, function* (priority = 0) {
      const [, releaser] = yield this._semaphore.acquire(1, priority);
      return releaser;
    });
  }
  runExclusive(callback, priority = 0) {
    return this._semaphore.runExclusive(() => callback(), 1, priority);
  }
  isLocked() {
    return this._semaphore.isLocked();
  }
  waitForUnlock(priority = 0) {
    return this._semaphore.waitForUnlock(1, priority);
  }
  release() {
    if (this._semaphore.isLocked())
      this._semaphore.release();
  }
  cancel() {
    return this._semaphore.cancel();
  }
};

// build-shims/capacitor-core.js
var Capacitor = { getPlatform() {
  return "web";
} };

// src/utils.ts
var Utils = class _Utils {
  /**
   * Converts a given number to its hexadecimal representation.
   */
  static numberToHex(n) {
    const hex = n.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }
  /**
   * Converts a DataView, Uint8Array, or number array to a hexadecimal string with byte separator.
   */
  static bufToHex(buf, separator = " ") {
    const arr = buf instanceof DataView ? this.dataViewToNumberArray(buf) : Array.from(buf);
    return arr.map((n) => _Utils.numberToHex(n)).join(separator);
  }
  /**
   * Converts a hexadecimal string to a Uint8Array buffer.
   */
  static hexToBuf(str) {
    const match = str.match(/[\da-f]{2}/gi);
    if (!match) {
      return new Uint8Array();
    }
    return new Uint8Array(
      match.map((h) => {
        return parseInt(h, 16);
      })
    );
  }
  /**
   * Converts a DataView object to an array of numbers.
   */
  static dataViewToNumberArray(dw) {
    const a = [];
    for (let i = 0; i < dw.byteLength; i++) {
      a.push(dw.getUint8(i));
    }
    return a;
  }
  /**
   * Converts a DataView object to a Uint8Array
   */
  static dataViewToU8Array(dw) {
    return Uint8Array.from(this.dataViewToNumberArray(dw));
  }
  /**
   * Converts a Uint8Array to a string using TextDecoder.
   */
  static u8ArrayToString(arr) {
    return new TextDecoder().decode(arr);
  }
  /**
   * Count `non-zero` bits in the byte array.
   *
   * For `split` mode:
   *
   * Data splitted to the three chunks (last chunk sizes can be lesser, base chunk size is `printhead size / 8 / 3`)
   * and `non-zero` bit count calculated from each chunk.
   *
   * If data size is more than `printheadPixels / 8`, only `total` mode can be used.
   *
   * For `total` mode:
   *
   * Return total number of pixel in little-endian format: `[0, LL, HH]`
   *
   * For `auto` mode:
   *
   * By default `split` mode used. If it is not available, `total` mode used.
   *
   **/
  static countPixelsForBitmapPacket(buf, printheadPixels, mode = "auto") {
    let total = 0;
    const parts = [0, 0, 0];
    const chunkSize = Math.floor(printheadPixels / 8 / 3);
    let split = buf.byteLength <= chunkSize * 3;
    if (mode === "total") {
      split = false;
    } else if (mode === "split") {
      if (buf.byteLength > chunkSize * 3) {
        console.warn(
          `Can't use split mode: buffer size (${buf.byteLength}) is large than chunk size * 3 (${chunkSize * 3}), maybe printheadPixels is set incorrectly`
        );
      } else {
        split = true;
      }
    }
    buf.forEach((value, byteN) => {
      const chunkIdx = Math.floor(byteN / chunkSize);
      for (let bitN = 0; bitN < 8; bitN++) {
        if ((value & 1 << bitN) !== 0) {
          total++;
          if (!split) {
            continue;
          }
          if (chunkIdx > 2) {
            console.warn(`Overflow (chunk index ${chunkIdx})`);
            continue;
          }
          parts[chunkIdx]++;
          if (parts[chunkIdx] > 255) {
            console.warn("Pixel count overflow");
          }
        }
      }
    });
    if (split) {
      return { total, parts };
    }
    const [c, b] = this.u16ToBytes(total);
    return { total, parts: [0, b, c] };
  }
  /**
   * Converts a 16-bit unsigned integer to an array of two bytes (big endian).
   */
  static u16ToBytes(n) {
    const h = n >> 8 & 255;
    const l = n % 256 & 255;
    return [h, l];
  }
  /**
   * Converts a 32-bit unsigned integer to an array of two bytes (big endian).
   */
  static u32ToBytes(n) {
    return [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  /**
   * Converts a Uint8Array of length 2 to a 16-bit signed integer (big endian).
   */
  static bytesToI16(arr) {
    Validators.u8ArrayLengthEquals(arr, 2);
    return new DataView(arr.buffer).getInt16(0, false);
  }
  /**
   * Converts a Uint8Array of length 2 to a 16-bit signed integer (big endian).
   */
  static bytesToI32(arr) {
    Validators.u8ArrayLengthEquals(arr, 4);
    return new DataView(arr.buffer).getInt32(0, false);
  }
  /**
   * Compares two Uint8Arrays to check if they are equal.
   */
  static u8ArraysEqual(a, b) {
    return a.length === b.length && a.every((el, i) => el === b[i]);
  }
  static u8ArrayAppend(src, data) {
    const newBuf = new Uint8Array(src.length + data.length);
    newBuf.set(src, 0);
    newBuf.set(data, src.length);
    return newBuf;
  }
  /**
   * Asynchronously pauses the execution for the specified amount of time.
   */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * Checks if the browser supports Bluetooth functionality.
   * @deprecated use {@link getAvailableTransports}
   */
  static isBluetoothSupported() {
    return typeof navigator.bluetooth?.requestDevice !== "undefined";
  }
  /**
   * Checks if the browser supports the Web Serial API for serial communication.
   * @deprecated use {@link getAvailableTransports}
   */
  static isSerialSupported() {
    return typeof navigator.serial?.requestPort !== "undefined";
  }
  /**
   * Checks environment functionality
   */
  static getAvailableTransports() {
    return {
      capacitorBle: Capacitor.getPlatform() !== "web",
      webBluetooth: typeof navigator.bluetooth?.requestDevice !== "undefined",
      webSerial: typeof navigator.serial?.requestPort !== "undefined"
    };
  }
  /** Find check array has subarray at index */
  static hasSubarrayAtPos(arr, sub, pos) {
    if (pos > arr.length - sub.length) {
      return false;
    }
    for (let i = 0; i < sub.length; i++) {
      if (arr[pos + i] !== sub[i]) {
        return false;
      }
    }
    return true;
  }
};
var Validators = class {
  /**
   * Compares two Uint8Arrays for equality and throws an error if they are not equal.
   */
  static u8ArraysEqual(arr, b, message) {
    if (!Utils.u8ArraysEqual(arr, b)) {
      throw new Error(message ?? "Arrays must be equal");
    }
  }
  /**
   * Checks if the length of a Uint8Array equals a specified length and throws an error if the lengths do not match.
   */
  static u8ArrayLengthEquals(arr, len, message) {
    if (arr.length !== len) {
      throw new Error(message ?? `Array length must be ${len}`);
    }
  }
  /**
   * Checks if the length of a Uint8Array is at least a specified length.
   * Throws an error if the length is less than the specified length.
   */
  static u8ArrayLengthAtLeast(arr, len, message) {
    if (arr.length < len) {
      throw new Error(message ?? `Array length must be at least ${len}`);
    }
  }
};

// src/packets/packet.ts
var import_crc_32 = __toESM(require_crc32());
var _NiimbotPacket = class _NiimbotPacket {
  constructor(command, data, validResponseIds = []) {
    this._command = command;
    this._data = data instanceof Uint8Array ? data : new Uint8Array(data);
    this._validResponseIds = validResponseIds;
    this._oneWay = false;
  }
  /** Data length (header, command, dataLen, checksum, tail are excluded). */
  get dataLength() {
    return this._data.length;
  }
  get length() {
    return _NiimbotPacket.HEAD.length + // head
    1 + // cmd
    1 + // dataLength
    this.dataLength + 1 + // checksum
    _NiimbotPacket.TAIL.length;
  }
  set oneWay(value) {
    this._oneWay = value;
  }
  get oneWay() {
    return this._oneWay;
  }
  get validResponseIds() {
    return this._validResponseIds;
  }
  set validResponseIds(ids) {
    this._validResponseIds = ids;
  }
  get command() {
    return this._command;
  }
  get data() {
    return this._data;
  }
  get checksum() {
    let checksum = 0;
    checksum ^= this._command;
    checksum ^= this._data.length;
    this._data.forEach((i) => checksum ^= i);
    return checksum;
  }
  /** [0x55, 0x55, CMD, DATA_LEN, DA =//= TA, CHECKSUM, 0xAA, 0xAA] */
  toBytes() {
    const buf = new ArrayBuffer(
      _NiimbotPacket.HEAD.length + // head
      1 + // cmd
      1 + // dataLength
      this._data.length + 1 + // checksum
      _NiimbotPacket.TAIL.length
    );
    const arr = new Uint8Array(buf);
    let pos = 0;
    arr.set(_NiimbotPacket.HEAD, pos);
    pos += _NiimbotPacket.HEAD.length;
    arr[pos] = this._command;
    pos += 1;
    arr[pos] = this._data.length;
    pos += 1;
    arr.set(this._data, pos);
    pos += this._data.length;
    arr[pos] = this.checksum;
    pos += 1;
    arr.set(_NiimbotPacket.TAIL, pos);
    if (this._command === 193 /* Connect */) {
      return new Uint8Array([3, ...arr]);
    }
    return arr;
  }
  static fromBytes(buf) {
    const head = new Uint8Array(buf.slice(0, 2));
    const tail = new Uint8Array(buf.slice(buf.length - 2));
    const minPacketSize = _NiimbotPacket.HEAD.length + // head
    1 + // cmd
    1 + // dataLength
    1 + // checksum
    _NiimbotPacket.TAIL.length;
    if (buf.length < minPacketSize) {
      throw new Error(`Packet is too small (${buf.length} < ${minPacketSize})`);
    }
    Validators.u8ArraysEqual(head, _NiimbotPacket.HEAD, "Invalid packet head");
    Validators.u8ArraysEqual(tail, _NiimbotPacket.TAIL, "Invalid packet tail");
    const cmd = buf[2];
    const dataLen = buf[3];
    if (buf.length !== minPacketSize + dataLen) {
      throw new Error(`Invalid packet size (${buf.length} < ${minPacketSize + dataLen})`);
    }
    const data = buf.slice(4, 4 + dataLen);
    const checksum = buf[4 + dataLen];
    const packet = new _NiimbotPacket(cmd, data);
    if (packet.checksum !== checksum) {
      throw new Error(`Invalid packet checksum (${packet.checksum} !== ${checksum})`);
    }
    return packet;
  }
};
_NiimbotPacket.HEAD = new Uint8Array([85, 85]);
_NiimbotPacket.TAIL = new Uint8Array([170, 170]);
var NiimbotPacket = _NiimbotPacket;
var NiimbotCrc32Packet = class _NiimbotCrc32Packet extends NiimbotPacket {
  constructor(command, chunkNumber, data, validResponseIds = []) {
    super(command, data, validResponseIds);
    this._chunkNumber = chunkNumber;
  }
  get chunkNumber() {
    return this._chunkNumber;
  }
  /** Calculate CRC checksum from command and data */
  get checksum() {
    const data = [this._command, ...Utils.u16ToBytes(this._chunkNumber), this._data.length, ...this._data];
    return import_crc_32.default.buf(data);
  }
  static fromBytes(buf) {
    const head = new Uint8Array(buf.slice(0, 2));
    const tail = new Uint8Array(buf.slice(buf.length - 2));
    const minPacketSize = NiimbotPacket.HEAD.length + // head
    1 + // cmd
    2 + // chunkNumber
    1 + // dataLength
    4 + // checksum
    NiimbotPacket.TAIL.length;
    if (buf.length < minPacketSize) {
      throw new Error(`Packet is too small (${buf.length} < ${minPacketSize})`);
    }
    Validators.u8ArraysEqual(head, NiimbotPacket.HEAD, "Invalid packet head");
    Validators.u8ArraysEqual(tail, NiimbotPacket.TAIL, "Invalid packet tail");
    const cmd = buf[2];
    const chunkNumber = Utils.bytesToI16(buf.slice(3, 5));
    const dataLen = buf[5];
    if (buf.length !== minPacketSize + dataLen) {
      throw new Error(`Invalid packet size (${buf.length} < ${minPacketSize + dataLen})`);
    }
    const data = buf.slice(6, 6 + dataLen);
    const checksum = Utils.bytesToI32(buf.slice(6 + dataLen, 6 + dataLen + 4));
    const packet = new _NiimbotCrc32Packet(cmd, chunkNumber, data);
    if (packet.checksum !== checksum) {
      throw new Error(`Invalid packet checksum (${packet.checksum} !== ${checksum})`);
    }
    return packet;
  }
  /** [0x55, 0x55, CMD, CHUNK_NUMBER, DATA_SIZE, DA =//= TA, CRC32_CHECKSUM, 0xAA, 0xAA] */
  toBytes() {
    const buf = new ArrayBuffer(
      NiimbotPacket.HEAD.length + // head
      1 + // cmd
      2 + // chunkNumber
      1 + // dataLength
      this._data.length + 4 + // checksum
      NiimbotPacket.TAIL.length
    );
    const arr = new Uint8Array(buf);
    let pos = 0;
    arr.set(NiimbotPacket.HEAD, pos);
    pos += NiimbotPacket.HEAD.length;
    arr[pos] = this._command;
    pos += 1;
    const [h, l] = Utils.u16ToBytes(this._chunkNumber);
    arr[pos] = h;
    pos += 1;
    arr[pos] = l;
    pos += 1;
    arr[pos] = this._data.length;
    pos += 1;
    arr.set(this._data, pos);
    pos += this._data.length;
    const crc = this.checksum;
    arr[pos] = crc >> 24 & 255;
    pos += 1;
    arr[pos] = crc >> 16 & 255;
    pos += 1;
    arr[pos] = crc >> 8 & 255;
    pos += 1;
    arr[pos] = crc & 255;
    pos += 1;
    arr.set(NiimbotPacket.TAIL, pos);
    return arr;
  }
};

// src/packets/commands.ts
var RequestCommandId = /* @__PURE__ */ ((RequestCommandId2) => {
  RequestCommandId2[RequestCommandId2["Invalid"] = -1] = "Invalid";
  RequestCommandId2[RequestCommandId2["Connect"] = 193] = "Connect";
  RequestCommandId2[RequestCommandId2["CancelPrint"] = 218] = "CancelPrint";
  RequestCommandId2[RequestCommandId2["CalibrateHeight"] = 89] = "CalibrateHeight";
  RequestCommandId2[RequestCommandId2["Heartbeat"] = 220] = "Heartbeat";
  RequestCommandId2[RequestCommandId2["LabelPositioningCalibration"] = 142] = "LabelPositioningCalibration";
  RequestCommandId2[RequestCommandId2["PageEnd"] = 227] = "PageEnd";
  RequestCommandId2[RequestCommandId2["PrinterLog"] = 5] = "PrinterLog";
  RequestCommandId2[RequestCommandId2["PageStart"] = 3] = "PageStart";
  RequestCommandId2[RequestCommandId2["PrintBitmapRow"] = 133] = "PrintBitmapRow";
  RequestCommandId2[RequestCommandId2["PrintBitmapRowIndexed"] = 131] = "PrintBitmapRowIndexed";
  RequestCommandId2[RequestCommandId2["PrintClear"] = 32] = "PrintClear";
  RequestCommandId2[RequestCommandId2["PrintEmptyRow"] = 132] = "PrintEmptyRow";
  RequestCommandId2[RequestCommandId2["PrintEnd"] = 243] = "PrintEnd";
  RequestCommandId2[RequestCommandId2["PrinterInfo"] = 64] = "PrinterInfo";
  RequestCommandId2[RequestCommandId2["PrinterConfig"] = 175] = "PrinterConfig";
  RequestCommandId2[RequestCommandId2["PrinterStatusData"] = 165] = "PrinterStatusData";
  RequestCommandId2[RequestCommandId2["PrinterReset"] = 40] = "PrinterReset";
  RequestCommandId2[RequestCommandId2["PrintQuantity"] = 21] = "PrintQuantity";
  RequestCommandId2[RequestCommandId2["PrintStart"] = 1] = "PrintStart";
  RequestCommandId2[RequestCommandId2["PrintStatus"] = 163] = "PrintStatus";
  RequestCommandId2[RequestCommandId2["RfidInfo"] = 26] = "RfidInfo";
  RequestCommandId2[RequestCommandId2["RfidInfo2"] = 28] = "RfidInfo2";
  RequestCommandId2[RequestCommandId2["RfidSuccessTimes"] = 84] = "RfidSuccessTimes";
  RequestCommandId2[RequestCommandId2["SetAutoShutdownTime"] = 39] = "SetAutoShutdownTime";
  RequestCommandId2[RequestCommandId2["SetDensity"] = 33] = "SetDensity";
  RequestCommandId2[RequestCommandId2["SetLabelType"] = 35] = "SetLabelType";
  RequestCommandId2[RequestCommandId2["SetPageSize"] = 19] = "SetPageSize";
  RequestCommandId2[RequestCommandId2["SoundSettings"] = 88] = "SoundSettings";
  RequestCommandId2[RequestCommandId2["AntiFake"] = 11] = "AntiFake";
  RequestCommandId2[RequestCommandId2["WriteRFID"] = 112] = "WriteRFID";
  RequestCommandId2[RequestCommandId2["PrintTestPage"] = 90] = "PrintTestPage";
  RequestCommandId2[RequestCommandId2["StartFirmwareUpgrade"] = 245] = "StartFirmwareUpgrade";
  RequestCommandId2[RequestCommandId2["FirmwareCrc"] = 145] = "FirmwareCrc";
  RequestCommandId2[RequestCommandId2["FirmwareCommit"] = 146] = "FirmwareCommit";
  RequestCommandId2[RequestCommandId2["FirmwareChunk"] = 155] = "FirmwareChunk";
  RequestCommandId2[RequestCommandId2["FirmwareNoMoreChunks"] = 156] = "FirmwareNoMoreChunks";
  RequestCommandId2[RequestCommandId2["PrinterCheckLine"] = 134] = "PrinterCheckLine";
  RequestCommandId2[RequestCommandId2["GetCurrentTimeFormat"] = 18] = "GetCurrentTimeFormat";
  RequestCommandId2[RequestCommandId2["PrinterConfig2"] = 7] = "PrinterConfig2";
  RequestCommandId2[RequestCommandId2["GetKeyFunction"] = 9] = "GetKeyFunction";
  RequestCommandId2[RequestCommandId2["GetPrintQuality"] = 13] = "GetPrintQuality";
  RequestCommandId2[RequestCommandId2["GetPrinterConfigurationWifi"] = 162] = "GetPrinterConfigurationWifi";
  return RequestCommandId2;
})(RequestCommandId || {});
var ResponseCommandId2 = /* @__PURE__ */ ((ResponseCommandId3) => {
  ResponseCommandId3[ResponseCommandId3["In_Invalid"] = -1] = "In_Invalid";
  ResponseCommandId3[ResponseCommandId3["In_NotSupported"] = 0] = "In_NotSupported";
  ResponseCommandId3[ResponseCommandId3["In_Connect"] = 194] = "In_Connect";
  ResponseCommandId3[ResponseCommandId3["In_CalibrateHeight"] = 105] = "In_CalibrateHeight";
  ResponseCommandId3[ResponseCommandId3["In_CancelPrint"] = 208] = "In_CancelPrint";
  ResponseCommandId3[ResponseCommandId3["In_AntiFake"] = 12] = "In_AntiFake";
  ResponseCommandId3[ResponseCommandId3["In_HeartbeatAdvanced1"] = 221] = "In_HeartbeatAdvanced1";
  ResponseCommandId3[ResponseCommandId3["In_HeartbeatBasic"] = 222] = "In_HeartbeatBasic";
  ResponseCommandId3[ResponseCommandId3["In_HeartbeatUnknown"] = 223] = "In_HeartbeatUnknown";
  ResponseCommandId3[ResponseCommandId3["In_HeartbeatAdvanced2"] = 217] = "In_HeartbeatAdvanced2";
  ResponseCommandId3[ResponseCommandId3["In_LabelPositioningCalibration"] = 143] = "In_LabelPositioningCalibration";
  ResponseCommandId3[ResponseCommandId3["In_PageStart"] = 4] = "In_PageStart";
  ResponseCommandId3[ResponseCommandId3["In_PrintClear"] = 48] = "In_PrintClear";
  ResponseCommandId3[ResponseCommandId3["In_PrinterCheckLine"] = 211] = "In_PrinterCheckLine";
  ResponseCommandId3[ResponseCommandId3["In_PrintEnd"] = 244] = "In_PrintEnd";
  ResponseCommandId3[ResponseCommandId3["In_PrinterConfig"] = 191] = "In_PrinterConfig";
  ResponseCommandId3[ResponseCommandId3["In_PrinterLog"] = 6] = "In_PrinterLog";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoAutoShutDownTime"] = 71] = "In_PrinterInfoAutoShutDownTime";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoBluetoothAddress"] = 77] = "In_PrinterInfoBluetoothAddress";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoSpeed"] = 66] = "In_PrinterInfoSpeed";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoDensity"] = 65] = "In_PrinterInfoDensity";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoLanguage"] = 70] = "In_PrinterInfoLanguage";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoChargeLevel"] = 74] = "In_PrinterInfoChargeLevel";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoHardWareVersion"] = 76] = "In_PrinterInfoHardWareVersion";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoLabelType"] = 67] = "In_PrinterInfoLabelType";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoPrinterCode"] = 72] = "In_PrinterInfoPrinterCode";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoSerialNumber"] = 75] = "In_PrinterInfoSerialNumber";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoSoftWareVersion"] = 73] = "In_PrinterInfoSoftWareVersion";
  ResponseCommandId3[ResponseCommandId3["In_PrinterInfoArea"] = 79] = "In_PrinterInfoArea";
  ResponseCommandId3[ResponseCommandId3["In_PrinterStatusData"] = 181] = "In_PrinterStatusData";
  ResponseCommandId3[ResponseCommandId3["In_PrinterReset"] = 56] = "In_PrinterReset";
  ResponseCommandId3[ResponseCommandId3["In_PrintStatus"] = 179] = "In_PrintStatus";
  ResponseCommandId3[ResponseCommandId3["In_PrintError"] = 219] = "In_PrintError";
  ResponseCommandId3[ResponseCommandId3["In_PrintQuantity"] = 22] = "In_PrintQuantity";
  ResponseCommandId3[ResponseCommandId3["In_PrintStart"] = 2] = "In_PrintStart";
  ResponseCommandId3[ResponseCommandId3["In_RfidInfo"] = 27] = "In_RfidInfo";
  ResponseCommandId3[ResponseCommandId3["In_RfidInfo2"] = 29] = "In_RfidInfo2";
  ResponseCommandId3[ResponseCommandId3["In_RfidSuccessTimes"] = 100] = "In_RfidSuccessTimes";
  ResponseCommandId3[ResponseCommandId3["In_SetAutoShutdownTime"] = 55] = "In_SetAutoShutdownTime";
  ResponseCommandId3[ResponseCommandId3["In_SetDensity"] = 49] = "In_SetDensity";
  ResponseCommandId3[ResponseCommandId3["In_SetLabelType"] = 51] = "In_SetLabelType";
  ResponseCommandId3[ResponseCommandId3["In_SetPageSize"] = 20] = "In_SetPageSize";
  ResponseCommandId3[ResponseCommandId3["In_SoundSettings"] = 104] = "In_SoundSettings";
  ResponseCommandId3[ResponseCommandId3["In_PageEnd"] = 228] = "In_PageEnd";
  ResponseCommandId3[ResponseCommandId3["In_PrinterPageIndex"] = 224] = "In_PrinterPageIndex";
  ResponseCommandId3[ResponseCommandId3["In_PrintTestPage"] = 106] = "In_PrintTestPage";
  ResponseCommandId3[ResponseCommandId3["In_WriteRFID"] = 113] = "In_WriteRFID";
  ResponseCommandId3[ResponseCommandId3["In_StartFirmwareUpgrade"] = 246] = "In_StartFirmwareUpgrade";
  ResponseCommandId3[ResponseCommandId3["In_RequestFirmwareCrc"] = 144] = "In_RequestFirmwareCrc";
  ResponseCommandId3[ResponseCommandId3["In_RequestFirmwareChunk"] = 154] = "In_RequestFirmwareChunk";
  ResponseCommandId3[ResponseCommandId3["In_FirmwareCheckResult"] = 157] = "In_FirmwareCheckResult";
  ResponseCommandId3[ResponseCommandId3["In_FirmwareResult"] = 158] = "In_FirmwareResult";
  ResponseCommandId3[ResponseCommandId3["In_ResetTimeout"] = 198] = "In_ResetTimeout";
  ResponseCommandId3[ResponseCommandId3["In_GetCurrentTimeFormat"] = 17] = "In_GetCurrentTimeFormat";
  ResponseCommandId3[ResponseCommandId3["In_PrinterConfig2"] = 8] = "In_PrinterConfig2";
  ResponseCommandId3[ResponseCommandId3["In_GetKeyFunction"] = 10] = "In_GetKeyFunction";
  ResponseCommandId3[ResponseCommandId3["In_GetPrintQuality"] = 13] = "In_GetPrintQuality";
  ResponseCommandId3[ResponseCommandId3["In_GetPrinterConfigurationWifi"] = 178] = "In_GetPrinterConfigurationWifi";
  return ResponseCommandId3;
})(ResponseCommandId2 || {});
var TX = RequestCommandId;
var RX = ResponseCommandId2;
var commandsMap = {
  [TX.Invalid]: null,
  [TX.PrintBitmapRow]: null,
  [TX.PrintBitmapRowIndexed]: null,
  [TX.PrintEmptyRow]: null,
  [TX.Connect]: [RX.In_Connect],
  [TX.CancelPrint]: [RX.In_CancelPrint],
  [TX.CalibrateHeight]: [RX.In_CalibrateHeight],
  [TX.Heartbeat]: [RX.In_HeartbeatBasic, RX.In_HeartbeatUnknown, RX.In_HeartbeatAdvanced1, RX.In_HeartbeatAdvanced2],
  [TX.LabelPositioningCalibration]: [RX.In_LabelPositioningCalibration],
  [TX.PageEnd]: [RX.In_PageEnd],
  [TX.PrinterLog]: [RX.In_PrinterLog],
  [TX.PageStart]: [RX.In_PageStart],
  [TX.PrintClear]: [RX.In_PrintClear],
  [TX.PrintEnd]: [RX.In_PrintEnd],
  [TX.PrinterInfo]: [
    RX.In_PrinterInfoArea,
    RX.In_PrinterInfoAutoShutDownTime,
    RX.In_PrinterInfoBluetoothAddress,
    RX.In_PrinterInfoChargeLevel,
    RX.In_PrinterInfoDensity,
    RX.In_PrinterInfoHardWareVersion,
    RX.In_PrinterInfoLabelType,
    RX.In_PrinterInfoLanguage,
    RX.In_PrinterInfoPrinterCode,
    RX.In_PrinterInfoSerialNumber,
    RX.In_PrinterInfoSoftWareVersion,
    RX.In_PrinterInfoSpeed
  ],
  [TX.PrinterConfig]: [RX.In_PrinterConfig],
  [TX.PrinterStatusData]: [RX.In_PrinterStatusData],
  [TX.PrinterReset]: [RX.In_PrinterReset],
  [TX.PrintQuantity]: [RX.In_PrintQuantity],
  [TX.PrintStart]: [RX.In_PrintStart],
  [TX.PrintStatus]: [RX.In_PrintStatus],
  [TX.RfidInfo]: [RX.In_RfidInfo],
  [TX.RfidInfo2]: [RX.In_RfidInfo2],
  [TX.RfidSuccessTimes]: [RX.In_RfidSuccessTimes],
  [TX.SetAutoShutdownTime]: [RX.In_SetAutoShutdownTime],
  [TX.SetDensity]: [RX.In_SetDensity],
  [TX.SetLabelType]: [RX.In_SetLabelType],
  [TX.SetPageSize]: [RX.In_SetPageSize],
  [TX.SoundSettings]: [RX.In_SoundSettings],
  [TX.AntiFake]: [RX.In_AntiFake],
  [TX.WriteRFID]: [RX.In_WriteRFID],
  [TX.PrintTestPage]: [RX.In_PrintTestPage],
  [TX.StartFirmwareUpgrade]: [RX.In_StartFirmwareUpgrade],
  [TX.FirmwareCrc]: null,
  [TX.FirmwareChunk]: null,
  [TX.FirmwareNoMoreChunks]: null,
  [TX.FirmwareCommit]: null,
  [TX.PrinterCheckLine]: [RX.In_PrinterCheckLine],
  [TX.GetCurrentTimeFormat]: [RX.In_GetCurrentTimeFormat],
  [TX.PrinterConfig2]: [RX.In_PrinterConfig2],
  [TX.GetKeyFunction]: [RX.In_GetKeyFunction],
  [TX.GetPrintQuality]: [RX.In_GetPrintQuality],
  [TX.GetPrinterConfigurationWifi]: [RX.In_GetPrinterConfigurationWifi]
};
var firmwareExchangePackets = {
  tx: [TX.FirmwareChunk, TX.FirmwareCrc, TX.FirmwareNoMoreChunks, TX.FirmwareCommit],
  rx: [RX.In_RequestFirmwareCrc, RX.In_RequestFirmwareChunk, RX.In_FirmwareCheckResult, RX.In_FirmwareResult]
};

// src/packets/payloads.ts
var PrinterInfoType = /* @__PURE__ */ ((PrinterInfoType3) => {
  PrinterInfoType3[PrinterInfoType3["Density"] = 1] = "Density";
  PrinterInfoType3[PrinterInfoType3["Speed"] = 2] = "Speed";
  PrinterInfoType3[PrinterInfoType3["LabelType"] = 3] = "LabelType";
  PrinterInfoType3[PrinterInfoType3["Language"] = 6] = "Language";
  PrinterInfoType3[PrinterInfoType3["AutoShutdownTime"] = 7] = "AutoShutdownTime";
  PrinterInfoType3[PrinterInfoType3["PrinterModelId"] = 8] = "PrinterModelId";
  PrinterInfoType3[PrinterInfoType3["SoftWareVersion"] = 9] = "SoftWareVersion";
  PrinterInfoType3[PrinterInfoType3["BatteryChargeLevel"] = 10] = "BatteryChargeLevel";
  PrinterInfoType3[PrinterInfoType3["SerialNumber"] = 11] = "SerialNumber";
  PrinterInfoType3[PrinterInfoType3["HardWareVersion"] = 12] = "HardWareVersion";
  PrinterInfoType3[PrinterInfoType3["BluetoothAddress"] = 13] = "BluetoothAddress";
  PrinterInfoType3[PrinterInfoType3["PrintMode"] = 14] = "PrintMode";
  PrinterInfoType3[PrinterInfoType3["Area"] = 15] = "Area";
  return PrinterInfoType3;
})(PrinterInfoType || {});
var SoundSettingsType = /* @__PURE__ */ ((SoundSettingsType2) => {
  SoundSettingsType2[SoundSettingsType2["SetSound"] = 1] = "SetSound";
  SoundSettingsType2[SoundSettingsType2["GetSoundState"] = 2] = "GetSoundState";
  return SoundSettingsType2;
})(SoundSettingsType || {});
var SoundSettingsItemType = /* @__PURE__ */ ((SoundSettingsItemType4) => {
  SoundSettingsItemType4[SoundSettingsItemType4["BluetoothConnectionSound"] = 1] = "BluetoothConnectionSound";
  SoundSettingsItemType4[SoundSettingsItemType4["PowerSound"] = 2] = "PowerSound";
  return SoundSettingsItemType4;
})(SoundSettingsItemType || {});
var LabelType = /* @__PURE__ */ ((LabelType2) => {
  LabelType2[LabelType2["Invalid"] = 0] = "Invalid";
  LabelType2[LabelType2["WithGaps"] = 1] = "WithGaps";
  LabelType2[LabelType2["Black"] = 2] = "Black";
  LabelType2[LabelType2["Continuous"] = 3] = "Continuous";
  LabelType2[LabelType2["Perforated"] = 4] = "Perforated";
  LabelType2[LabelType2["Transparent"] = 5] = "Transparent";
  LabelType2[LabelType2["PvcTag"] = 6] = "PvcTag";
  LabelType2[LabelType2["BlackMarkGap"] = 10] = "BlackMarkGap";
  LabelType2[LabelType2["HeatShrinkTube"] = 11] = "HeatShrinkTube";
  return LabelType2;
})(LabelType || {});
var HeartbeatType = /* @__PURE__ */ ((HeartbeatType3) => {
  HeartbeatType3[HeartbeatType3["Advanced1"] = 1] = "Advanced1";
  HeartbeatType3[HeartbeatType3["Basic"] = 2] = "Basic";
  HeartbeatType3[HeartbeatType3["Unknown"] = 3] = "Unknown";
  HeartbeatType3[HeartbeatType3["Advanced2"] = 4] = "Advanced2";
  return HeartbeatType3;
})(HeartbeatType || {});
var AutoShutdownTime = /* @__PURE__ */ ((AutoShutdownTime4) => {
  AutoShutdownTime4[AutoShutdownTime4["ShutdownTime1"] = 1] = "ShutdownTime1";
  AutoShutdownTime4[AutoShutdownTime4["ShutdownTime2"] = 2] = "ShutdownTime2";
  AutoShutdownTime4[AutoShutdownTime4["ShutdownTime3"] = 3] = "ShutdownTime3";
  AutoShutdownTime4[AutoShutdownTime4["ShutdownTime4"] = 4] = "ShutdownTime4";
  return AutoShutdownTime4;
})(AutoShutdownTime || {});
var BatteryChargeLevel = /* @__PURE__ */ ((BatteryChargeLevel3) => {
  BatteryChargeLevel3[BatteryChargeLevel3["Charge0"] = 0] = "Charge0";
  BatteryChargeLevel3[BatteryChargeLevel3["Charge25"] = 1] = "Charge25";
  BatteryChargeLevel3[BatteryChargeLevel3["Charge50"] = 2] = "Charge50";
  BatteryChargeLevel3[BatteryChargeLevel3["Charge75"] = 3] = "Charge75";
  BatteryChargeLevel3[BatteryChargeLevel3["Charge100"] = 4] = "Charge100";
  return BatteryChargeLevel3;
})(BatteryChargeLevel || {});
var ConnectResult = /* @__PURE__ */ ((ConnectResult3) => {
  ConnectResult3[ConnectResult3["Disconnect"] = 0] = "Disconnect";
  ConnectResult3[ConnectResult3["Connected"] = 1] = "Connected";
  ConnectResult3[ConnectResult3["ConnectedNew"] = 2] = "ConnectedNew";
  ConnectResult3[ConnectResult3["ConnectedV3"] = 3] = "ConnectedV3";
  ConnectResult3[ConnectResult3["FirmwareErrors"] = 90] = "FirmwareErrors";
  return ConnectResult3;
})(ConnectResult || {});
var PrinterErrorCode = /* @__PURE__ */ ((PrinterErrorCode2) => {
  PrinterErrorCode2[PrinterErrorCode2["CoverOpen"] = 1] = "CoverOpen";
  PrinterErrorCode2[PrinterErrorCode2["LackPaper"] = 2] = "LackPaper";
  PrinterErrorCode2[PrinterErrorCode2["LowBattery"] = 3] = "LowBattery";
  PrinterErrorCode2[PrinterErrorCode2["BatteryException"] = 4] = "BatteryException";
  PrinterErrorCode2[PrinterErrorCode2["UserCancel"] = 5] = "UserCancel";
  PrinterErrorCode2[PrinterErrorCode2["DataError"] = 6] = "DataError";
  PrinterErrorCode2[PrinterErrorCode2["Overheat"] = 7] = "Overheat";
  PrinterErrorCode2[PrinterErrorCode2["PaperOutException"] = 8] = "PaperOutException";
  PrinterErrorCode2[PrinterErrorCode2["PrinterBusy"] = 9] = "PrinterBusy";
  PrinterErrorCode2[PrinterErrorCode2["NoPrinterHead"] = 10] = "NoPrinterHead";
  PrinterErrorCode2[PrinterErrorCode2["TemperatureLow"] = 11] = "TemperatureLow";
  PrinterErrorCode2[PrinterErrorCode2["PrinterHeadLoose"] = 12] = "PrinterHeadLoose";
  PrinterErrorCode2[PrinterErrorCode2["NoRibbon"] = 13] = "NoRibbon";
  PrinterErrorCode2[PrinterErrorCode2["WrongRibbon"] = 14] = "WrongRibbon";
  PrinterErrorCode2[PrinterErrorCode2["UsedRibbon"] = 15] = "UsedRibbon";
  PrinterErrorCode2[PrinterErrorCode2["WrongPaper"] = 16] = "WrongPaper";
  PrinterErrorCode2[PrinterErrorCode2["SetPaperFail"] = 17] = "SetPaperFail";
  PrinterErrorCode2[PrinterErrorCode2["SetPrintModeFail"] = 18] = "SetPrintModeFail";
  PrinterErrorCode2[PrinterErrorCode2["SetPrintDensityFail"] = 19] = "SetPrintDensityFail";
  PrinterErrorCode2[PrinterErrorCode2["WriteRfidFail"] = 20] = "WriteRfidFail";
  PrinterErrorCode2[PrinterErrorCode2["SetMarginFail"] = 21] = "SetMarginFail";
  PrinterErrorCode2[PrinterErrorCode2["CommunicationException"] = 22] = "CommunicationException";
  PrinterErrorCode2[PrinterErrorCode2["Disconnect"] = 23] = "Disconnect";
  PrinterErrorCode2[PrinterErrorCode2["CanvasParameterError"] = 24] = "CanvasParameterError";
  PrinterErrorCode2[PrinterErrorCode2["RotationParameterException"] = 25] = "RotationParameterException";
  PrinterErrorCode2[PrinterErrorCode2["JsonParameterException"] = 26] = "JsonParameterException";
  PrinterErrorCode2[PrinterErrorCode2["B3sAbnormalPaperOutput"] = 27] = "B3sAbnormalPaperOutput";
  PrinterErrorCode2[PrinterErrorCode2["ECheckPaper"] = 28] = "ECheckPaper";
  PrinterErrorCode2[PrinterErrorCode2["RfidTagNotWritten"] = 29] = "RfidTagNotWritten";
  PrinterErrorCode2[PrinterErrorCode2["SetPrintDensityNoSupport"] = 30] = "SetPrintDensityNoSupport";
  PrinterErrorCode2[PrinterErrorCode2["SetPrintModeNoSupport"] = 31] = "SetPrintModeNoSupport";
  PrinterErrorCode2[PrinterErrorCode2["SetPrintLabelMaterialError"] = 32] = "SetPrintLabelMaterialError";
  PrinterErrorCode2[PrinterErrorCode2["SetPrintLabelMaterialNoSupport"] = 33] = "SetPrintLabelMaterialNoSupport";
  PrinterErrorCode2[PrinterErrorCode2["NotSupportWrittenRfid"] = 34] = "NotSupportWrittenRfid";
  PrinterErrorCode2[PrinterErrorCode2["IllegalPage"] = 50] = "IllegalPage";
  PrinterErrorCode2[PrinterErrorCode2["IllegalRibbonPage"] = 51] = "IllegalRibbonPage";
  PrinterErrorCode2[PrinterErrorCode2["ReceiveDataTimeout"] = 52] = "ReceiveDataTimeout";
  PrinterErrorCode2[PrinterErrorCode2["NonDedicatedRibbon"] = 53] = "NonDedicatedRibbon";
  return PrinterErrorCode2;
})(PrinterErrorCode || {});

// src/image_encoder.ts
var ImageEncoder = class _ImageEncoder {
  /** printDirection = "left" rotates image for 90 degrees clockwise */
  static encodeCanvas(canvas, printDirection = "left") {
    const ctx = canvas.getContext("2d");
    const iData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rowsData = [];
    let cols = canvas.width;
    let rows = canvas.height;
    if (printDirection === "left") {
      cols = canvas.height;
      rows = canvas.width;
    }
    if (cols % 8 !== 0) {
      throw new Error("Column count must be multiple of 8");
    }
    for (let row = 0; row < rows; row++) {
      let isVoid = true;
      let blackPixelsCount = 0;
      const rowData = new Uint8Array(cols / 8);
      for (let colOct = 0; colOct < cols / 8; colOct++) {
        let pixelsOctet = 0;
        for (let colBit = 0; colBit < 8; colBit++) {
          if (_ImageEncoder.isPixelNonWhite(iData, colOct * 8 + colBit, row, printDirection)) {
            pixelsOctet |= 1 << 7 - colBit;
            isVoid = false;
            blackPixelsCount++;
          }
        }
        rowData[colOct] = pixelsOctet;
      }
      const newPart = {
        dataType: isVoid ? "void" : "pixels",
        rowNumber: row,
        repeat: 1,
        rowData: isVoid ? void 0 : rowData,
        blackPixelsCount
      };
      if (rowsData.length === 0) {
        rowsData.push(newPart);
      } else {
        const lastPacket = rowsData[rowsData.length - 1];
        let same = newPart.dataType === lastPacket.dataType;
        if (same && newPart.dataType === "pixels") {
          same = Utils.u8ArraysEqual(newPart.rowData, lastPacket.rowData);
        }
        if (same) {
          lastPacket.repeat++;
        } else {
          rowsData.push(newPart);
        }
        const sendRowCheck = row % 200 === 199;
        if (sendRowCheck) {
          rowsData.push({
            dataType: "check",
            rowNumber: row,
            repeat: 0,
            rowData: void 0,
            blackPixelsCount: 0
          });
        }
      }
    }
    return { cols, rows, rowsData };
  }
  /** printDirection = "left" rotates image to 90 degrees clockwise */
  static isPixelNonWhite(iData, x, y, printDirection = "left") {
    let idx = y * iData.width + x;
    if (printDirection === "left") {
      idx = (iData.height - 1 - x) * iData.width + y;
    }
    idx *= 4;
    return iData.data[idx] !== 255 || iData.data[idx + 1] !== 255 || iData.data[idx + 2] !== 255;
  }
  /**
   * @param data Pixels encoded by {@link encodeCanvas} (byte is 8 pixels)
   * @returns Array of indexes where every index stored in two bytes (big endian)
   */
  static indexPixels(data) {
    const result = [];
    for (let bytePos = 0; bytePos < data.byteLength; bytePos++) {
      const b = data[bytePos];
      for (let bitPos = 0; bitPos < 8; bitPos++) {
        if (b & 1 << 7 - bitPos) {
          result.push(...Utils.u16ToBytes(bytePos * 8 + bitPos));
        }
      }
    }
    return new Uint8Array(result);
  }
};

// src/packets/packet_generator.ts
var PacketGenerator = class {
  /**
   * Maps a request command ID to its corresponding response IDs and creates a packet object.
   * Sends `0x01` as payload by default.
   */
  static mapped(sendCmd, data = [1]) {
    const respIds = commandsMap[sendCmd];
    if (respIds === null) {
      const p = new NiimbotPacket(sendCmd, data);
      p.oneWay = true;
      return p;
    }
    return new NiimbotPacket(sendCmd, data, respIds);
  }
  static connect() {
    return this.mapped(193 /* Connect */);
  }
  static getPrinterStatusData() {
    return this.mapped(165 /* PrinterStatusData */);
  }
  static rfidInfo() {
    return this.mapped(26 /* RfidInfo */);
  }
  static rfidInfo2() {
    return this.mapped(28 /* RfidInfo2 */);
  }
  static antiFake(queryType) {
    return this.mapped(11 /* AntiFake */, [queryType]);
  }
  static setAutoShutDownTime(time) {
    return this.mapped(39 /* SetAutoShutdownTime */, [time]);
  }
  static getPrinterInfo(type) {
    return this.mapped(64 /* PrinterInfo */, [type]);
  }
  static setSoundSettings(soundType, on) {
    return this.mapped(88 /* SoundSettings */, [1 /* SetSound */, soundType, on ? 1 : 0]);
  }
  static getSoundSettings(soundType) {
    return this.mapped(88 /* SoundSettings */, [2 /* GetSoundState */, soundType, 1]);
  }
  static heartbeat(type) {
    return this.mapped(220 /* Heartbeat */, [type]);
  }
  static setDensity(value) {
    return this.mapped(33 /* SetDensity */, [value]);
  }
  static setLabelType(value) {
    return this.mapped(35 /* SetLabelType */, [value]);
  }
  static setPageSize2b(rows) {
    return this.mapped(19 /* SetPageSize */, [...Utils.u16ToBytes(rows)]);
  }
  /**
   * B1 behavior: strange, first print is blank or printer prints many copies (use {@link setPageSize6b} instead)
   *
   * D110 behavior: ordinary.
   *
   * @param rows Height in pixels
   * @param cols Width in pixels
   */
  static setPageSize4b(rows, cols) {
    return this.mapped(19 /* SetPageSize */, [...Utils.u16ToBytes(rows), ...Utils.u16ToBytes(cols)]);
  }
  /**
   * @param rows Height in pixels
   * @param cols Width in pixels
   * @param copiesCount Page instances
   */
  static setPageSize6b(rows, cols, copiesCount) {
    return this.mapped(19 /* SetPageSize */, [
      ...Utils.u16ToBytes(rows),
      ...Utils.u16ToBytes(cols),
      ...Utils.u16ToBytes(copiesCount)
    ]);
  }
  /** First seen on D110M v4 */
  static setPageSize13b(rows, cols, copiesCount, cutHeight = 0, cutType = 0, sendAll = 0, partHeight = 0) {
    return this.mapped(19 /* SetPageSize */, [
      ...Utils.u16ToBytes(rows),
      ...Utils.u16ToBytes(cols),
      ...Utils.u16ToBytes(copiesCount),
      ...Utils.u16ToBytes(cutHeight),
      cutType,
      0,
      sendAll,
      ...Utils.u16ToBytes(partHeight)
    ]);
  }
  static setPrintQuantity(quantity) {
    return this.mapped(21 /* PrintQuantity */, [...Utils.u16ToBytes(quantity)]);
  }
  static printStatus() {
    return this.mapped(163 /* PrintStatus */);
  }
  /** Reset printer settings (sound and maybe some other settings). */
  static printerReset() {
    return this.mapped(40 /* PrinterReset */);
  }
  /**
   * B1 behavior: after {@link pageEnd} paper stops at printhead position, on {@link printEnd} paper moved further.
   *
   * D110 behavior: ordinary.
   * */
  static printStart1b() {
    return this.mapped(1 /* PrintStart */);
  }
  static printStart2b(totalPages) {
    return this.mapped(1 /* PrintStart */, [...Utils.u16ToBytes(totalPages)]);
  }
  /**
   * B1 behavior: when {@link totalPages} > 1 after {@link pageEnd} paper stops at printhead position and waits for next page.
   * When last page ({@link totalPages}) printed paper moved further.
   *
   * D110 behavior: ordinary.
   *
   * @param totalPages Declare how many pages will be printed
   */
  static printStart7b(totalPages, pageColor = 0) {
    return this.mapped(1 /* PrintStart */, [...Utils.u16ToBytes(totalPages), 0, 0, 0, 0, pageColor]);
  }
  /** First seen on D110M v4 */
  static printStart9b(totalPages, pageColor = 0, speed = 0, someFlag = false) {
    return this.mapped(1 /* PrintStart */, [...Utils.u16ToBytes(totalPages), 0, 0, 0, 0, pageColor, speed, someFlag ? 1 : 0]);
  }
  static printEnd() {
    return this.mapped(243 /* PrintEnd */);
  }
  static pageStart() {
    return this.mapped(3 /* PageStart */);
  }
  static pageEnd() {
    return this.mapped(227 /* PageEnd */);
  }
  static printEmptySpace(pos, repeats) {
    return this.mapped(132 /* PrintEmptyRow */, [...Utils.u16ToBytes(pos), repeats]);
  }
  static printBitmapRow(pos, repeats, data, printheadPixels, countsMode = "auto") {
    const counts = Utils.countPixelsForBitmapPacket(data, printheadPixels, countsMode);
    return this.mapped(133 /* PrintBitmapRow */, [...Utils.u16ToBytes(pos), ...counts.parts, repeats, ...data]);
  }
  /** Printer powers off if black pixel count > 6 */
  // 5555 83 0e 007e 000400 01 0027 0028 0029 002a fa aaaa
  static printBitmapRowIndexed(pos, repeats, data, printheadPixels, countsMode = "auto") {
    const counts = Utils.countPixelsForBitmapPacket(data, printheadPixels ?? 0, countsMode);
    const indexes = ImageEncoder.indexPixels(data);
    if (counts.total > 6) {
      throw new Error(`Black pixel count > 6 (${counts.total})`);
    }
    return this.mapped(131 /* PrintBitmapRowIndexed */, [...Utils.u16ToBytes(pos), ...counts.parts, repeats, ...indexes]);
  }
  static printClear() {
    return this.mapped(32 /* PrintClear */);
  }
  static writeRfid(data) {
    return this.mapped(112 /* WriteRFID */, data);
  }
  static checkLine(line) {
    return this.mapped(134 /* PrinterCheckLine */, [...Utils.u16ToBytes(line), 1]);
  }
  static writeImageData(image, options) {
    const out = [];
    for (const d of image.rowsData) {
      if (d.dataType === "pixels") {
        if (d.blackPixelsCount <= 6 && !options?.noIndexPacket) {
          out.push(
            this.printBitmapRowIndexed(
              d.rowNumber,
              d.repeat,
              d.rowData,
              options?.printheadPixels ?? 0,
              options?.countsMode ?? "auto"
            )
          );
        } else {
          out.push(
            this.printBitmapRow(
              d.rowNumber,
              d.repeat,
              d.rowData,
              options?.printheadPixels ?? 0,
              options?.countsMode ?? "auto"
            )
          );
        }
        continue;
      }
      if (d.dataType === "check" && options?.enableCheckLine) {
        out.push(this.checkLine(d.rowNumber));
        continue;
      }
      if (d.dataType === "void") {
        out.push(this.printEmptySpace(d.rowNumber, d.repeat));
      }
    }
    return out;
  }
  static printTestPage() {
    return this.mapped(90 /* PrintTestPage */);
  }
  static labelPositioningCalibration(value) {
    return this.mapped(142 /* LabelPositioningCalibration */, [value]);
  }
  static startFirmwareUpgrade(version) {
    if (!/^\d+\.\d+$/.test(version)) {
      throw new Error("Invalid version format (x.x expected)");
    }
    const [a, b] = version.split(".").map((p) => parseInt(p));
    return this.mapped(245 /* StartFirmwareUpgrade */, [a, b]);
  }
  static sendFirmwareChecksum(crc) {
    const p = new NiimbotCrc32Packet(145 /* FirmwareCrc */, 0, [...Utils.u32ToBytes(crc)]);
    p.oneWay = true;
    return p;
  }
  static sendFirmwareChunk(idx, data) {
    const p = new NiimbotCrc32Packet(155 /* FirmwareChunk */, idx, data);
    p.oneWay = true;
    return p;
  }
  static firmwareNoMoreChunks() {
    const p = new NiimbotCrc32Packet(156 /* FirmwareNoMoreChunks */, 0, [1]);
    p.oneWay = true;
    return p;
  }
  static firmwareCommit() {
    const p = new NiimbotCrc32Packet(146 /* FirmwareCommit */, 0, [1]);
    p.oneWay = true;
    return p;
  }
};

// src/packets/packet_parser.ts
var PacketParser = class {
  /**
   * Parse raw data containing one or more packets.
   *
   * For example, `55554a01044faaaa5555f60101f6aaaa` will be converted to the two NiimbotPackets.
   *
   * @param buf bytes
   * @returns list of packet objects
   */
  static parsePacketBundle(buf) {
    const chunks = [];
    const bufLength = buf.byteLength;
    while (buf.byteLength > 0) {
      if (!Utils.hasSubarrayAtPos(buf, NiimbotPacket.HEAD, 0)) {
        break;
      }
      if (buf.byteLength < 3) {
        break;
      }
      const cmd = buf[2];
      let cls = NiimbotPacket;
      let sizePos = 3;
      let crcSize = 1;
      if (firmwareExchangePackets.rx.includes(cmd) || firmwareExchangePackets.tx.includes(cmd)) {
        cls = NiimbotCrc32Packet;
        sizePos = 5;
        crcSize = 4;
      }
      if (buf.byteLength <= sizePos) {
        break;
      }
      const size = buf[sizePos];
      if (buf.byteLength <= sizePos + size + crcSize + NiimbotPacket.TAIL.byteLength) {
        break;
      }
      const tailPos = sizePos + size + crcSize + 1;
      if (!Utils.hasSubarrayAtPos(buf, NiimbotPacket.TAIL, tailPos)) {
        console.warn("Invalid tail");
        break;
      }
      const tailEnd = tailPos + NiimbotPacket.TAIL.byteLength;
      chunks.push({ cls, raw: buf.slice(0, tailEnd) });
      buf = buf.slice(tailEnd);
    }
    const chunksDataLen = chunks.reduce((acc, c) => acc + c.raw.length, 0);
    if (bufLength !== chunksDataLen) {
      throw new Error(`Splitted chunks data length not equals buffer length (${bufLength} !== ${chunksDataLen})`);
    }
    return chunks.map((c) => c.cls.fromBytes(c.raw));
  }
};

// src/events.ts
var NiimbotEvent = class {
  constructor(type) {
    this.type = type;
  }
};
var ConnectEvent = class extends NiimbotEvent {
  constructor(info) {
    super("connect");
    this.info = info;
  }
};
var DisconnectEvent = class extends NiimbotEvent {
  constructor() {
    super("disconnect");
  }
};
var PacketReceivedEvent = class extends NiimbotEvent {
  constructor(packet) {
    super("packetreceived");
    this.packet = packet;
  }
};
var PacketSentEvent = class extends NiimbotEvent {
  constructor(packet) {
    super("packetsent");
    this.packet = packet;
  }
};
var RawPacketSentEvent = class extends NiimbotEvent {
  constructor(data) {
    super("rawpacketsent");
    this.data = data;
  }
};
var RawPacketReceivedEvent = class extends NiimbotEvent {
  constructor(data) {
    super("rawpacketreceived");
    this.data = data;
  }
};
var HeartbeatEvent = class extends NiimbotEvent {
  constructor(data) {
    super("heartbeat");
    this.data = data;
  }
};
var HeartbeatFailedEvent = class extends NiimbotEvent {
  constructor(failedAttempts) {
    super("heartbeatfailed");
    this.failedAttempts = failedAttempts;
  }
};
var PrinterInfoFetchedEvent = class extends NiimbotEvent {
  constructor(info) {
    super("printerinfofetched");
    this.info = info;
  }
};
var PrintProgressEvent = class extends NiimbotEvent {
  constructor(page, pagesTotal, pagePrintProgress, pageFeedProgress) {
    super("printprogress");
    this.page = page;
    this.pagesTotal = pagesTotal;
    this.pagePrintProgress = pagePrintProgress;
    this.pageFeedProgress = pageFeedProgress;
  }
};
var FirmwareProgressEvent = class extends NiimbotEvent {
  constructor(currentChunk, totalChunks) {
    super("firmwareprogress");
    this.currentChunk = currentChunk;
    this.totalChunks = totalChunks;
  }
};

// src/printer_models.ts
var PrinterModel = /* @__PURE__ */ ((PrinterModel2) => {
  PrinterModel2["UNKNOWN"] = "UNKNOWN";
  PrinterModel2["A20"] = "A20";
  PrinterModel2["A203"] = "A203";
  PrinterModel2["A63"] = "A63";
  PrinterModel2["A8"] = "A8";
  PrinterModel2["A8_P"] = "A8_P";
  PrinterModel2["B1"] = "B1";
  PrinterModel2["B1_PRO"] = "B1_PRO";
  PrinterModel2["B1_SE"] = "B1_SE";
  PrinterModel2["B11"] = "B11";
  PrinterModel2["B16"] = "B16";
  PrinterModel2["B18"] = "B18";
  PrinterModel2["B18S"] = "B18S";
  PrinterModel2["B2"] = "B2";
  PrinterModel2["B2_PRO"] = "B2_PRO";
  PrinterModel2["B203"] = "B203";
  PrinterModel2["B21"] = "B21";
  PrinterModel2["B21_PRO"] = "B21_PRO";
  PrinterModel2["B21_C2B"] = "B21_C2B";
  PrinterModel2["B21_L2B"] = "B21_L2B";
  PrinterModel2["B21S"] = "B21S";
  PrinterModel2["B21S_C2B"] = "B21S_C2B";
  PrinterModel2["B3"] = "B3";
  PrinterModel2["B31"] = "B31";
  PrinterModel2["B32"] = "B32";
  PrinterModel2["B32R"] = "B32R";
  PrinterModel2["B3S"] = "B3S";
  PrinterModel2["B3S_P"] = "B3S_P";
  PrinterModel2["B4"] = "B4";
  PrinterModel2["B50"] = "B50";
  PrinterModel2["B50W"] = "B50W";
  PrinterModel2["BETTY"] = "BETTY";
  PrinterModel2["C1"] = "C1";
  PrinterModel2["D101"] = "D101";
  PrinterModel2["D11"] = "D11";
  PrinterModel2["D11_H"] = "D11_H";
  PrinterModel2["D11_PRO"] = "D11_PRO";
  PrinterModel2["D110"] = "D110";
  PrinterModel2["D110_M"] = "D110_M";
  PrinterModel2["D11S"] = "D11S";
  PrinterModel2["D41"] = "D41";
  PrinterModel2["D61"] = "D61";
  PrinterModel2["DXX"] = "DXX";
  PrinterModel2["EP2M_H"] = "EP2M_H";
  PrinterModel2["EP3M"] = "EP3M";
  PrinterModel2["ET10"] = "ET10";
  PrinterModel2["FUST"] = "FUST";
  PrinterModel2["H1"] = "H1";
  PrinterModel2["H1S"] = "H1S";
  PrinterModel2["HI_D110"] = "HI_D110";
  PrinterModel2["HI_NB_D11"] = "HI_NB_D11";
  PrinterModel2["JC_M90"] = "JC_M90";
  PrinterModel2["JCB3S"] = "JCB3S";
  PrinterModel2["K2"] = "K2";
  PrinterModel2["K3"] = "K3";
  PrinterModel2["K3_W"] = "K3_W";
  PrinterModel2["M2_H"] = "M2_H";
  PrinterModel2["M3"] = "M3";
  PrinterModel2["MP3K"] = "MP3K";
  PrinterModel2["MP3K_W"] = "MP3K_W";
  PrinterModel2["N1"] = "N1";
  PrinterModel2["P1"] = "P1";
  PrinterModel2["P18"] = "P18";
  PrinterModel2["P1S"] = "P1S";
  PrinterModel2["S1"] = "S1";
  PrinterModel2["S3"] = "S3";
  PrinterModel2["S6"] = "S6";
  PrinterModel2["S6_P"] = "S6_P";
  PrinterModel2["T2S"] = "T2S";
  PrinterModel2["T6"] = "T6";
  PrinterModel2["T7"] = "T7";
  PrinterModel2["T8"] = "T8";
  PrinterModel2["T8S"] = "T8S";
  PrinterModel2["TP2M_H"] = "TP2M_H";
  PrinterModel2["Z401"] = "Z401";
  return PrinterModel2;
})(PrinterModel || {});
var modelsLibrary = [
  {
    model: "A20" /* A20 */,
    id: [2817],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 400,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "A203" /* A203 */,
    id: [2818],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 400,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "A63" /* A63 */,
    id: [2054],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 851,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */],
    densityMin: 1,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "A8" /* A8 */,
    id: [256],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 576,
    paperTypes: [2 /* Black */, 1 /* WithGaps */, 3 /* Continuous */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "A8_P" /* A8_P */,
    id: [273],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 576,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B1" /* B1 */,
    id: [4096],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B1_PRO" /* B1_PRO */,
    id: [4097],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 567,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B1_SE" /* B1_SE */,
    id: [4098],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B11" /* B11 */,
    id: [51457],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */, 5 /* Transparent */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "B16" /* B16 */,
    id: [1792],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "B18" /* B18 */,
    id: [3584],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 10 /* BlackMarkGap */, 11 /* HeatShrinkTube */, 3 /* Continuous */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "B18S" /* B18S */,
    id: [3585],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 10 /* BlackMarkGap */, 11 /* HeatShrinkTube */, 3 /* Continuous */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "B2" /* B2 */,
    id: [6913],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B2_PRO" /* B2_PRO */,
    id: [6912],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 567,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B203" /* B203 */,
    id: [2816],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 400,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B21" /* B21 */,
    id: [768],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B21_PRO" /* B21_PRO */,
    id: [785],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 591,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B21_C2B" /* B21_C2B */,
    id: [771, 775],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 3 /* Continuous */, 5 /* Transparent */, 2 /* Black */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B21_L2B" /* B21_L2B */,
    id: [769],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B21S" /* B21S */,
    id: [777],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B21S_C2B" /* B21S_C2B */,
    id: [776],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B3" /* B3 */,
    id: [52993],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 600,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B31" /* B31 */,
    id: [5632],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 600,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B32" /* B32 */,
    id: [2049],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 851,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "B32R" /* B32R */,
    id: [2050],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 851,
    paperTypes: [1 /* WithGaps */],
    densityMin: 1,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "B3S" /* B3S */,
    id: [256, 260, 262],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 576,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B3S_P" /* B3S_P */,
    id: [272],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 576,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B4" /* B4 */,
    id: [6656],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 832,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "B50" /* B50 */,
    id: [51713],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 400,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "B50W" /* B50W */,
    id: [51714],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "BETTY" /* BETTY */,
    id: [2561],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 192,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "C1" /* C1 */,
    id: [5120],
    dpi: 300,
    printDirection: "left",
    printheadPixels: 178,
    paperTypes: [3 /* Continuous */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "D101" /* D101 */,
    id: [2560],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 192,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "D11" /* D11 */,
    id: [512],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "D11_H" /* D11_H */,
    id: [528],
    dpi: 300,
    printDirection: "left",
    printheadPixels: 142,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "D11_PRO" /* D11_PRO */,
    id: [531],
    dpi: 300,
    printDirection: "left",
    printheadPixels: 142,
    paperTypes: [5 /* Transparent */, 1 /* WithGaps */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "D110" /* D110 */,
    id: [2304, 2305],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "D110_M" /* D110_M */,
    id: [2320],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "D11S" /* D11S */,
    id: [514],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "EP2M_H" /* EP2M_H */,
    id: [4610],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 567,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "EP3M" /* EP3M */,
    id: [6402],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 851,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "ET10" /* ET10 */,
    id: [5376],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 1600,
    paperTypes: [3 /* Continuous */],
    densityMin: 3,
    densityMax: 3,
    densityDefault: 3
  },
  {
    model: "FUST" /* FUST */,
    id: [513],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "H1" /* H1 */,
    id: [3840],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "H1S" /* H1S */,
    id: [4352],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "HI_D110" /* HI_D110 */,
    id: [2305],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 120,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 3
  },
  {
    model: "HI_NB_D11" /* HI_NB_D11 */,
    id: [512],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 120,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "JC_M90" /* JC_M90 */,
    id: [51461],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "JCB3S" /* JCB3S */,
    id: [256],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 576,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 2
  },
  {
    model: "K2" /* K2 */,
    id: [6144],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 448,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "K3" /* K3 */,
    id: [4864],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 640,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "K3_W" /* K3_W */,
    id: [4865],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 640,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "M2_H" /* M2_H */,
    id: [4608],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 567,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "M3" /* M3 */,
    id: [6400],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 851,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "MP3K" /* MP3K */,
    id: [4866],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 640,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "MP3K_W" /* MP3K_W */,
    id: [4867],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 640,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "N1" /* N1 */,
    id: [3586],
    dpi: 203,
    printDirection: "left",
    printheadPixels: 96,
    paperTypes: [1 /* WithGaps */, 11 /* HeatShrinkTube */, 5 /* Transparent */, 10 /* BlackMarkGap */, 3 /* Continuous */],
    densityMin: 1,
    densityMax: 3,
    densityDefault: 2
  },
  {
    model: "P1" /* P1 */,
    id: [1024],
    dpi: 300,
    printDirection: "left",
    printheadPixels: 697,
    paperTypes: [6 /* PvcTag */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "P18" /* P18 */,
    id: [1026],
    dpi: 300,
    printDirection: "left",
    printheadPixels: 662,
    paperTypes: [6 /* PvcTag */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "P1S" /* P1S */,
    id: [1025],
    dpi: 300,
    printDirection: "left",
    printheadPixels: 662,
    paperTypes: [6 /* PvcTag */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "S1" /* S1 */,
    id: [51458],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "S3" /* S3 */,
    id: [51460],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "S6" /* S6 */,
    id: [261, 259, 258, 257],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 576,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "S6_P" /* S6_P */,
    id: [274],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 600,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "T2S" /* T2S */,
    id: [53250],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 832,
    paperTypes: [1 /* WithGaps */, 2 /* Black */],
    densityMin: 1,
    densityMax: 20,
    densityDefault: 15
  },
  {
    model: "T6" /* T6 */,
    id: [51715],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "T7" /* T7 */,
    id: [51717],
    dpi: 203,
    printDirection: "top",
    printheadPixels: 384,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "T8" /* T8 */,
    id: [51718],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 567,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
    densityMin: 6,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "T8S" /* T8S */,
    id: [2053],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 851,
    paperTypes: [1 /* WithGaps */],
    densityMin: 1,
    densityMax: 15,
    densityDefault: 10
  },
  {
    model: "TP2M_H" /* TP2M_H */,
    id: [4609],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 591,
    paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 5,
    densityDefault: 3
  },
  {
    model: "Z401" /* Z401 */,
    id: [2051],
    dpi: 300,
    printDirection: "top",
    printheadPixels: 851,
    paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
    densityMin: 1,
    densityMax: 15,
    densityDefault: 10
  }
];
var getPrinterMetaById = (id) => {
  return modelsLibrary.find((o) => o.id.includes(id));
};
var getPrinterMetaByModel = (model) => {
  return modelsLibrary.find((o) => o.model === model);
};

// src/print_tasks/AbstractPrintTask.ts
var printOptionsDefaults = {
  labelType: 1 /* WithGaps */,
  density: 2,
  totalPages: 1,
  statusPollIntervalMs: 300,
  statusTimeoutMs: 5e3,
  pageTimeoutMs: 1e4,
  speed: 1,
  color: 0
};
var AbstractPrintTask = class {
  constructor(abstraction, printOptions) {
    this.abstraction = abstraction;
    this.pagesPrinted = 0;
    this.printOptions = {
      ...printOptionsDefaults,
      ...printOptions
    };
  }
  /** Check added pages not does not exceed {@link pagesPrinted} */
  checkAddPage(quantity) {
    if (this.pagesPrinted + quantity > (this.printOptions.totalPages ?? 1)) {
      throw new Error("Trying to print too many pages (task totalPages may not be set correctly)");
    }
    this.pagesPrinted += quantity;
  }
  /** Wait for page print is finished */
  waitForPageFinished() {
    return Promise.resolve();
  }
  /** Printer's printhead resolution in pixels */
  printheadPixels() {
    return this.abstraction.getClient().getModelMetadata()?.printheadPixels;
  }
  /** End print, cleanup */
  printEnd() {
    return this.abstraction.printEnd();
  }
};

// src/print_tasks/B1PrintTask.ts
var B1PrintTask = class extends AbstractPrintTask {
  printInit() {
    return this.abstraction.sendAll([
      PacketGenerator.setDensity(this.printOptions.density),
      PacketGenerator.setLabelType(this.printOptions.labelType),
      PacketGenerator.printStart7b(this.printOptions.totalPages, this.printOptions.color)
    ]);
  }
  printPage(image, quantity) {
    this.checkAddPage(quantity ?? 1);
    return this.abstraction.sendAll(
      [
        PacketGenerator.pageStart(),
        PacketGenerator.setPageSize6b(image.rows, image.cols, quantity ?? 1),
        ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
        PacketGenerator.pageEnd()
      ],
      this.printOptions.pageTimeoutMs
    );
  }
  waitForFinished() {
    this.abstraction.setPacketTimeout(this.printOptions.statusTimeoutMs);
    return this.abstraction.waitUntilPrintFinishedByStatusPoll(this.printOptions.totalPages, this.printOptions.statusPollIntervalMs).finally(() => this.abstraction.setDefaultPacketTimeout());
  }
};

// src/print_tasks/B21V1PrintTask.ts
var B21V1PrintTask = class extends AbstractPrintTask {
  printInit() {
    return this.abstraction.sendAll([
      PacketGenerator.setDensity(this.printOptions.density),
      PacketGenerator.setLabelType(this.printOptions.labelType),
      PacketGenerator.printStart1b()
    ]);
  }
  async printPage(image, quantity) {
    this.checkAddPage(quantity ?? 1);
    for (let i = 0; i < (quantity ?? 1); i++) {
      await this.abstraction.sendAll(
        [
          // PacketGenerator.printClear(),
          PacketGenerator.pageStart(),
          PacketGenerator.setPageSize4b(image.rows, image.cols),
          ...PacketGenerator.writeImageData(image, {
            countsMode: "total",
            enableCheckLine: true,
            printheadPixels: this.printheadPixels()
          }),
          PacketGenerator.pageEnd()
        ],
        this.printOptions.pageTimeoutMs
      );
    }
  }
  waitForFinished() {
    this.abstraction.setPacketTimeout(this.printOptions.statusTimeoutMs);
    return this.abstraction.waitUntilPrintFinishedByPrintEndPoll(this.printOptions.totalPages, this.printOptions.statusPollIntervalMs).finally(() => this.abstraction.setDefaultPacketTimeout());
  }
};

// src/print_tasks/D110PrintTask.ts
var D110PrintTask = class extends AbstractPrintTask {
  printInit() {
    return this.abstraction.sendAll([
      PacketGenerator.setDensity(this.printOptions.density),
      PacketGenerator.setLabelType(this.printOptions.labelType),
      PacketGenerator.printStart1b()
    ]);
  }
  printPage(image, quantity) {
    this.checkAddPage(quantity ?? 1);
    return this.abstraction.sendAll(
      [
        PacketGenerator.printClear(),
        PacketGenerator.pageStart(),
        PacketGenerator.setPageSize4b(image.rows, image.cols),
        PacketGenerator.setPrintQuantity(quantity ?? 1),
        ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
        PacketGenerator.pageEnd()
      ],
      this.printOptions.pageTimeoutMs
    );
  }
  waitForPageFinished() {
    this.abstraction.setPacketTimeout(this.printOptions.statusTimeoutMs);
    return this.abstraction.waitUntilPrintFinishedByStatusPoll(this.pagesPrinted, this.printOptions.statusPollIntervalMs).finally(() => this.abstraction.setDefaultPacketTimeout());
  }
  waitForFinished() {
    return this.waitForPageFinished();
  }
};

// src/print_tasks/OldD11PrintTask.ts
var OldD11PrintTask = class extends AbstractPrintTask {
  printInit() {
    return this.abstraction.sendAll([
      PacketGenerator.setDensity(this.printOptions.density),
      PacketGenerator.setLabelType(this.printOptions.labelType),
      PacketGenerator.printStart1b()
    ]);
  }
  printPage(image, quantity) {
    this.checkAddPage(quantity ?? 1);
    return this.abstraction.sendAll(
      [
        PacketGenerator.printClear(),
        PacketGenerator.pageStart(),
        PacketGenerator.setPageSize2b(image.rows),
        PacketGenerator.setPrintQuantity(quantity ?? 1),
        ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
        PacketGenerator.pageEnd()
      ],
      this.printOptions.pageTimeoutMs
    );
  }
  waitForFinished() {
    return this.abstraction.waitUntilPrintFinishedByPageIndex(
      this.printOptions.totalPages ?? 1,
      this.printOptions.statusTimeoutMs
    );
  }
};

// src/print_tasks/D110MV4PrintTask.ts
var D110MV4PrintTask = class extends AbstractPrintTask {
  printInit() {
    return this.abstraction.sendAll([
      PacketGenerator.setDensity(this.printOptions.density),
      PacketGenerator.setLabelType(this.printOptions.labelType),
      PacketGenerator.printStart9b(this.printOptions.totalPages, this.printOptions.color, this.printOptions.speed)
    ]);
  }
  async printPage(image, quantity) {
    this.checkAddPage(quantity ?? 1);
    const statusPacket = PacketGenerator.printStatus();
    statusPacket.oneWay = true;
    await this.abstraction.send(statusPacket);
    return this.abstraction.sendAll(
      [
        PacketGenerator.setPageSize13b(image.rows, image.cols, quantity ?? 1),
        ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
        PacketGenerator.pageEnd()
      ],
      this.printOptions.pageTimeoutMs
    );
  }
  waitForFinished() {
    this.abstraction.setPacketTimeout(this.printOptions.statusTimeoutMs);
    return this.abstraction.waitUntilPrintFinishedByStatusPoll(this.printOptions.totalPages ?? 1, this.printOptions.statusPollIntervalMs).finally(() => this.abstraction.setDefaultPacketTimeout());
  }
  async printEnd() {
    const pkt = PacketGenerator.heartbeat(1 /* Advanced1 */);
    pkt.oneWay = true;
    const result = await this.abstraction.printEnd();
    await this.abstraction.send(pkt);
    return result;
  }
};

// src/print_tasks/index.ts
var printTasks = {
  D11_V1: OldD11PrintTask,
  D110: D110PrintTask,
  B1: B1PrintTask,
  B21_V1: B21V1PrintTask,
  D110M_V4: D110MV4PrintTask
};
var printTaskNames = Object.keys(printTasks);
var modelPrintTasks = {
  D11_V1: ["D11" /* D11 */, "D11S" /* D11S */],
  B21_V1: ["B21" /* B21 */, "B21_L2B" /* B21_L2B */],
  D110: ["B21S" /* B21S */, "B21S_C2B" /* B21S_C2B */, "D110" /* D110 */, { m: "D11" /* D11 */, v: 1 }, { m: "D11" /* D11 */, v: 2 }],
  B1: ["D110_M" /* D110_M */, "B1" /* B1 */, "B21_C2B" /* B21_C2B */, "M2_H" /* M2_H */, "N1" /* N1 */, "D101" /* D101 */],
  D110M_V4: [{ m: "D110_M" /* D110_M */, v: 4 }, "D11_H" /* D11_H */, "B21_PRO" /* B21_PRO */, "B1_PRO" /* B1_PRO */]
};
var findPrintTask = (model, protocolVersion) => {
  const tasks = Object.keys(modelPrintTasks);
  const foundExact = tasks.find(
    (key) => modelPrintTasks[key]?.find(
      (o) => typeof o === "object" && o.v === protocolVersion && o.m === model
    )
  );
  return foundExact ?? tasks.find((key) => modelPrintTasks[key]?.includes(model));
};

// src/packets/data_reader.ts
var SequentialDataReader = class {
  constructor(bytes) {
    this.bytes = bytes;
    this.offset = 0;
  }
  /** Check available bytes */
  canRead(count) {
    return this.offset + count <= this.bytes.length;
  }
  /** Check available bytes and throw exception if EOF met */
  willRead(count) {
    if (!this.canRead(count)) {
      throw new Error("Tried to read too much data");
    }
  }
  /** Skip bytes */
  skip(len) {
    this.willRead(len);
    this.offset += len;
  }
  /** Read fixed length bytes */
  readBytes(len) {
    this.willRead(len);
    const part = this.bytes.slice(this.offset, this.offset + len);
    this.offset += len;
    return part;
  }
  /** Read variable length bytes */
  readVBytes() {
    const len = this.readI8();
    const part = this.readBytes(len);
    return part;
  }
  /** Read variable length string */
  readVString() {
    const part = this.readVBytes();
    return Utils.u8ArrayToString(part);
  }
  /** Read 8 bit int (big endian) */
  readI8() {
    this.willRead(1);
    const result = this.bytes[this.offset];
    this.offset += 1;
    return result;
  }
  readBool() {
    return this.readI8() > 0;
  }
  /** Read 16 bit int (big endian) */
  readI16() {
    this.willRead(2);
    const part = this.bytes.slice(this.offset, this.offset + 2);
    this.offset += 2;
    return Utils.bytesToI16(part);
  }
  /** Check EOF condition */
  end() {
    if (this.offset != this.bytes.length) {
      throw new Error("Extra data left");
    }
  }
};

// src/packets/dto.ts
var PrintError = class extends Error {
  constructor(message, reasonId) {
    super(message);
    this.reasonId = reasonId;
  }
};

// src/packets/abstraction.ts
var import_crc_322 = __toESM(require_crc32());
var Abstraction = class {
  constructor(client) {
    this.DEFAULT_PACKET_TIMEOUT = 1e3;
    this.packetTimeout = this.DEFAULT_PACKET_TIMEOUT;
    this.client = client;
  }
  getClient() {
    return this.client;
  }
  getPacketTimeout() {
    return this.packetTimeout;
  }
  setPacketTimeout(value) {
    this.packetTimeout = value;
  }
  setDefaultPacketTimeout() {
    this.packetTimeout = this.DEFAULT_PACKET_TIMEOUT;
  }
  /** Send packet and wait for response */
  async send(packet, forceTimeout) {
    return this.client.sendPacketWaitResponse(packet, forceTimeout ?? this.packetTimeout);
  }
  /** Send packet, wait for response, repeat if failed */
  async sendRepeatUntilSuccess(packet, attempts, forceTimeout) {
    let lastError = new Error("Unknown error");
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await this.client.sendPacketWaitResponse(packet, forceTimeout ?? this.packetTimeout);
      } catch (e) {
        console.warn(`Attempt ${attempt + 1} failed:`, e);
        lastError = e;
      }
    }
    throw lastError;
  }
  async sendAll(packets, forceTimeout) {
    for (const p of packets) {
      await this.send(p, forceTimeout);
    }
  }
  async getPrintStatus(tries = 1) {
    const packet = await this.sendRepeatUntilSuccess(PacketGenerator.printStatus(), tries ?? 1);
    Validators.u8ArrayLengthAtLeast(packet.data, 4);
    const r = new SequentialDataReader(packet.data);
    const page = r.readI16();
    const pagePrintProgress = r.readI8();
    const pageFeedProgress = r.readI8();
    if (packet.dataLength === 10) {
      r.skip(2);
      const error = r.readI8();
      if (error !== 0) {
        throw new PrintError(`Print error (${ResponseCommandId2[packet.command]} packet flag)`, error);
      }
    }
    return { page, pagePrintProgress, pageFeedProgress };
  }
  async connectResult() {
    const packet = await this.send(PacketGenerator.connect());
    Validators.u8ArrayLengthAtLeast(packet.data, 1);
    return packet.data[0];
  }
  async getPrinterStatusData() {
    let protocolVersion = 0;
    const packet = await this.send(PacketGenerator.getPrinterStatusData());
    let supportColor = 0;
    if (packet.dataLength > 12) {
      supportColor = packet.data[10];
      const n = packet.data[11] * 100 + packet.data[12];
      if (n >= 204 && n < 300) {
        protocolVersion = 3;
      } else if (n < 300 || n >= 302) {
        protocolVersion = n >= 302 ? 5 : 0;
      } else {
        protocolVersion = 4;
      }
    }
    return {
      supportColor,
      protocolVersion
    };
  }
  async getPrinterModel() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(8 /* PrinterModelId */));
    Validators.u8ArrayLengthAtLeast(packet.data, 1);
    if (packet.data.length === 1) {
      return packet.data[0] << 8;
    }
    Validators.u8ArrayLengthEquals(packet.data, 2);
    return Utils.bytesToI16(packet.data);
  }
  processRfidInfo(packet) {
    const info = {
      tagPresent: false,
      uuid: "",
      barCode: "",
      serialNumber: "",
      allPaper: -1,
      usedPaper: -1,
      consumablesType: 0 /* Invalid */
    };
    if (packet.dataLength === 1) {
      return info;
    }
    const r = new SequentialDataReader(packet.data);
    info.tagPresent = true;
    info.uuid = Utils.bufToHex(r.readBytes(8), "");
    info.barCode = r.readVString();
    info.serialNumber = r.readVString();
    info.allPaper = r.readI16();
    info.usedPaper = r.readI16();
    info.consumablesType = r.readI8();
    if (r.canRead(2)) {
      info.capacity = r.readI16();
    }
    r.end();
    return info;
  }
  /** Read paper nfc tag info */
  async rfidInfo() {
    const packet = await this.send(PacketGenerator.rfidInfo());
    return this.processRfidInfo(packet);
  }
  /** Read ribbon nfc tag info */
  async rfidInfo2() {
    const packet = await this.send(PacketGenerator.rfidInfo2());
    return this.processRfidInfo(packet);
  }
  processHeartbeatAdvanced1(packet) {
    const len = packet.dataLength;
    const r = new SequentialDataReader(packet.data);
    const info = {};
    if (len === 10) {
      r.skip(8);
      info.lidClosed = r.readI8() === 0;
      info.chargeLevel = r.readI8();
    } else if (len === 13) {
      r.skip(9);
      info.lidClosed = r.readI8() === 0;
      info.chargeLevel = r.readI8();
      info.paperInserted = r.readI8() === 0;
      info.paperRfidSuccess = r.readI8() !== 0;
    } else if (len === 19) {
      r.skip(15);
      info.lidClosed = r.readI8() === 0;
      info.chargeLevel = r.readI8();
      info.paperInserted = r.readI8() === 0;
      info.paperRfidSuccess = r.readI8() !== 0;
    } else if (len === 20) {
      r.skip(18);
      info.paperInserted = r.readI8() === 0;
      info.paperRfidSuccess = r.readI8() !== 0;
    } else {
      throw new Error("Invalid heartbeat length");
    }
    r.end();
    const printerInfo = this.client.getPrinterInfo();
    const invertedLidModels = [512, 514, 513, 2304, 1792, 3584, 5120, 2560, 3840, 4352, 272, 273, 274];
    if (printerInfo?.modelId !== void 0 && invertedLidModels.includes(printerInfo.modelId)) {
      info.lidClosed = !info.lidClosed;
    }
    return info;
  }
  processHeartbeatAdvanced2(packet) {
    const r = new SequentialDataReader(packet.data);
    const info = {};
    Validators.u8ArrayLengthAtLeast(packet.data, 9);
    r.skip(2);
    info.chargeLevel = r.readI8();
    info.temp = r.readI8();
    info.lidClosed = r.readI8() === 0;
    info.paperInserted = r.readI8() === 0;
    info.paperRfidSuccess = r.readI8() !== 0;
    info.ribbonRfidSuccess = r.readI8() !== 0;
    info.ribbonInserted = r.readI8() === 0;
    if (r.canRead(2)) {
      info.wifiRssi = r.readI16();
    }
    if (r.canRead(2)) {
      r.skip(1);
      info.lightingErrorCode = r.readI8();
    }
    if (r.canRead(1)) {
      info.voltageState = r.readI8();
    }
    r.end();
    return info;
  }
  async heartbeat() {
    const printerInfo = this.client.getPrinterInfo();
    let heartbeatType = 1 /* Advanced1 */;
    if (printerInfo.protocolVersion !== void 0 && printerInfo.protocolVersion >= 3) {
      heartbeatType = 4 /* Advanced2 */;
    }
    const packet = await this.send(PacketGenerator.heartbeat(heartbeatType), 500);
    if (packet.command === 221 /* In_HeartbeatAdvanced1 */) {
      return this.processHeartbeatAdvanced1(packet);
    }
    if (packet.command === 217 /* In_HeartbeatAdvanced2 */) {
      return this.processHeartbeatAdvanced2(packet);
    }
    throw new Error("Unsupported heartbeat response");
  }
  async getBatteryChargeLevel() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(10 /* BatteryChargeLevel */));
    Validators.u8ArrayLengthEquals(packet.data, 1);
    return packet.data[0];
  }
  async getAutoShutDownTime() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(7 /* AutoShutdownTime */));
    Validators.u8ArrayLengthEquals(packet.data, 1);
    return packet.data[0];
  }
  /** May be wrong, version format varies between models */
  async getSoftwareVersion() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(9 /* SoftWareVersion */));
    Validators.u8ArrayLengthEquals(packet.data, 2);
    const v1 = packet.data[1] / 100 + packet.data[0];
    const v2 = (packet.data[0] * 256 + packet.data[1]) / 100;
    return `0x${Utils.bufToHex(packet.data, "")} (${v1.toFixed(2)} or ${v2.toFixed(2)})`;
  }
  /** May be wrong, version format varies between models */
  async getHardwareVersion() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(12 /* HardWareVersion */));
    Validators.u8ArrayLengthEquals(packet.data, 2);
    const v1 = packet.data[1] / 100 + packet.data[0];
    const v2 = (packet.data[0] * 256 + packet.data[1]) / 100;
    return `0x${Utils.bufToHex(packet.data, "")} (${v1.toFixed(2)} or ${v2.toFixed(2)})`;
  }
  async setAutoShutDownTime(time) {
    await this.send(PacketGenerator.setAutoShutDownTime(time));
  }
  async getLabelType() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(3 /* LabelType */));
    Validators.u8ArrayLengthEquals(packet.data, 1);
    return packet.data[0];
  }
  async getPrinterSerialNumber() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(11 /* SerialNumber */));
    Validators.u8ArrayLengthAtLeast(packet.data, 1);
    if (packet.data.length < 4) {
      return "-1";
    }
    if (packet.data.length >= 8) {
      return Utils.u8ArrayToString(packet.data);
    }
    return Utils.bufToHex(packet.data.slice(0, 4), "").toUpperCase();
  }
  async getPrinterBluetoothMacAddress() {
    const packet = await this.send(PacketGenerator.getPrinterInfo(13 /* BluetoothAddress */));
    Validators.u8ArrayLengthAtLeast(packet.data, 1);
    return Utils.bufToHex(packet.data.reverse(), ":");
  }
  async isSoundEnabled(soundType) {
    const packet = await this.send(PacketGenerator.getSoundSettings(soundType));
    Validators.u8ArrayLengthEquals(packet.data, 3);
    const value = !!packet.data[2];
    return value;
  }
  async setSoundEnabled(soundType, value) {
    await this.send(PacketGenerator.setSoundSettings(soundType, value));
  }
  /** Clear settings */
  async printerReset() {
    await this.send(PacketGenerator.printerReset());
  }
  async waitUntilPrintFinishedByPageIndex(pagesToPrint, timeoutMs = 5e3) {
    return new Promise((resolve, reject) => {
      const listener = (evt) => {
        if (evt.packet.command === 224 /* In_PrinterPageIndex */) {
          Validators.u8ArrayLengthEquals(evt.packet.data, 2);
          const page = Utils.bytesToI16(evt.packet.data);
          this.client.emit("printprogress", new PrintProgressEvent(page, pagesToPrint, 100, 100));
          clearTimeout(this.statusTimeoutTimer);
          this.statusTimeoutTimer = setTimeout(() => {
            this.client.off("packetreceived", listener);
            reject(new Error("Timeout waiting print status"));
          }, timeoutMs ?? 5e3);
          if (page === pagesToPrint) {
            clearTimeout(this.statusTimeoutTimer);
            this.client.off("packetreceived", listener);
            resolve();
          }
        }
      };
      clearTimeout(this.statusTimeoutTimer);
      this.statusTimeoutTimer = setTimeout(() => {
        this.client.off("packetreceived", listener);
        reject(new Error("Timeout waiting print status"));
      }, timeoutMs);
      this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
      this.client.on("packetreceived", listener);
    });
  }
  /**
   * Poll printer every {@link pollIntervalMs} and resolve when printer pages equals {@link pagesToPrint}, pagePrintProgress=100, pageFeedProgress=100.
   *
   * printprogress event is firing during this process.
   *
   * @param pagesToPrint Total pages to print.
   * @param pollIntervalMs Poll interval in milliseconds.
   */
  async waitUntilPrintFinishedByStatusPoll(pagesToPrint, pollIntervalMs = 300) {
    return new Promise((resolve, reject) => {
      this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
      this.statusPollTimer = setInterval(() => {
        this.getPrintStatus(2).then((status) => {
          this.client.emit(
            "printprogress",
            new PrintProgressEvent(status.page, pagesToPrint, status.pagePrintProgress, status.pageFeedProgress)
          );
          if (status.page === pagesToPrint) {
            clearInterval(this.statusPollTimer);
            resolve();
          }
        }).catch((e) => {
          clearInterval(this.statusPollTimer);
          reject(e);
        });
      }, pollIntervalMs ?? 300);
    });
  }
  /**
   * Poll printer every {@link pollIntervalMs} and resolve when printer pages equals {@link pagesToPrint}.
   *
   * printprogress event is firing during this process.
   *
   * PrintEnd call is not needed after this functions is done running.
   *
   * @param pagesToPrint Total pages to print.
   * @param pollIntervalMs Poll interval in milliseconds.
   */
  async waitUntilPrintFinishedByPrintEndPoll(pagesToPrint, pollIntervalMs = 500) {
    return new Promise((resolve, reject) => {
      this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
      this.statusPollTimer = setInterval(() => {
        this.printEnd().then((printEndDone) => {
          if (!printEndDone) {
            this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
          } else {
            this.client.emit("printprogress", new PrintProgressEvent(pagesToPrint, pagesToPrint, 100, 100));
            clearInterval(this.statusPollTimer);
            resolve();
          }
        }).catch((e) => {
          clearInterval(this.statusPollTimer);
          reject(e);
        });
      }, pollIntervalMs ?? 500);
    });
  }
  /** False returned when printEnd refused */
  async printEnd() {
    const response = await this.send(PacketGenerator.printEnd());
    Validators.u8ArrayLengthEquals(response.data, 1);
    return response.data[0] === 1;
  }
  /**
   * When 1 or 2 sent to B1, it starts to throw out some, paper (~15cm)
   * @param value success
   */
  async labelPositioningCalibration(value) {
    const response = await this.send(PacketGenerator.labelPositioningCalibration(value));
    Validators.u8ArrayLengthEquals(response.data, 1);
    return response.data[0] === 1;
  }
  async firmwareUpgrade(data, version) {
    const crc = import_crc_322.default.buf(data);
    await this.send(PacketGenerator.startFirmwareUpgrade(version));
    await this.client.waitForPacket([144 /* In_RequestFirmwareCrc */], true, 5e3);
    await this.send(PacketGenerator.sendFirmwareChecksum(crc));
    const chunkSize = 200;
    const totalChunks = Math.floor(data.byteLength / chunkSize);
    console.log("Chunks to send:", totalChunks);
    while (true) {
      const p = await this.client.waitForPacket(
        [154 /* In_RequestFirmwareChunk */, 158 /* In_FirmwareResult */],
        true,
        5e3
      );
      if (p.command === 158 /* In_FirmwareResult */) {
        throw new Error("Unexpected firmware result");
      }
      if (!(p instanceof NiimbotCrc32Packet)) {
        throw new Error("Not a firmware packet");
      }
      if (p.chunkNumber * chunkSize >= data.length) {
        console.log("No more chunks");
        break;
      }
      const part = data.slice(p.chunkNumber * chunkSize, p.chunkNumber * chunkSize + chunkSize);
      await this.send(PacketGenerator.sendFirmwareChunk(p.chunkNumber, part));
      this.client.emit("firmwareprogress", new FirmwareProgressEvent(p.chunkNumber, totalChunks));
    }
    await this.send(PacketGenerator.firmwareNoMoreChunks());
    const uploadResult = await this.client.waitForPacket([157 /* In_FirmwareCheckResult */], true, 5e3);
    Validators.u8ArrayLengthEquals(uploadResult.data, 1);
    if (uploadResult.data[0] !== 1) {
      throw new Error("Firmware check error (maybe CRC does not match)");
    }
    await this.send(PacketGenerator.firmwareCommit());
    const firmwareResult = await this.client.waitForPacket([158 /* In_FirmwareResult */], true, 5e3);
    Validators.u8ArrayLengthEquals(firmwareResult.data, 1);
    if (firmwareResult.data[0] !== 1) {
      throw new Error("Firmware error");
    }
  }
  newPrintTask(name, options) {
    return new printTasks[name](this, options);
  }
};

// src/client/abstract_client.ts
var NIIMBOT_CLIENT_DEFAULTS = {
  packetIntervalMs: 10,
  heartbeatIntervalMs: 2e3
};
var NiimbotAbstractClient = class extends import_index.default {
  constructor() {
    super();
    this.info = {};
    this.heartbeatFails = 0;
    this.heartbeatIntervalMs = NIIMBOT_CLIENT_DEFAULTS.heartbeatIntervalMs;
    this.mutex = new Mutex();
    this.debug = false;
    this.packetBuf = new Uint8Array();
    /** @see https://github.com/MultiMote/niimblue/issues/5 */
    this.packetIntervalMs = NIIMBOT_CLIENT_DEFAULTS.packetIntervalMs;
    this.abstraction = new Abstraction(this);
    this.on("connect", () => this.startHeartbeat());
    this.on("disconnect", () => {
      this.stopHeartbeat();
      this.packetBuf = new Uint8Array();
    });
  }
  /**
   * Send packet and wait for response for {@link timeoutMs} milliseconds.
   *
   * If {@link NiimbotPacket.validResponseIds() validResponseIds} is defined, it will wait for packet with this command id.
   *
   * @throws {@link PrintError} when {@link ResponseCommandId.In_PrintError} or {@link ResponseCommandId.In_NotSupported} received.
   *
   * @returns {NiimbotPacket} Packet object.
   */
  async sendPacketWaitResponse(packet, timeoutMs = 1e3) {
    return this.mutex.runExclusive(async () => {
      await this.sendPacket(packet, true);
      if (packet.oneWay) {
        return new NiimbotPacket(-1 /* In_Invalid */, []);
      }
      return this.waitForPacket(packet.validResponseIds, true, timeoutMs);
    });
  }
  /**
   * Send wait for response for {@link timeoutMs} milliseconds.
   *
   * If {@link ids} is set, it will wait for packet with this command ids.
   *
   * @throws {@link PrintError} when {@link ResponseCommandId.In_PrintError} or {@link ResponseCommandId.In_NotSupported} received and {@link catchErrorPackets} is true.
   *
   * @returns {NiimbotPacket} Packet object.
   */
  async waitForPacket(ids = [], catchErrorPackets = true, timeoutMs = 1e3) {
    return new Promise((resolve, reject) => {
      let timeout = void 0;
      const listener = (evt) => {
        const pktIn = evt.packet;
        const cmdIn = pktIn.command;
        if (ids.length === 0 || ids.includes(cmdIn) || catchErrorPackets && [219 /* In_PrintError */, 0 /* In_NotSupported */].includes(cmdIn)) {
          clearTimeout(timeout);
          this.off("packetreceived", listener);
          if (cmdIn === 219 /* In_PrintError */) {
            Validators.u8ArrayLengthEquals(pktIn.data, 1);
            const errorName = PrinterErrorCode[pktIn.data[0]] ?? "unknown";
            reject(new PrintError(`Print error ${pktIn.data[0]}: ${errorName}`, pktIn.data[0]));
          } else if (cmdIn === 0 /* In_NotSupported */) {
            reject(new PrintError("Feature not supported", 0));
          } else {
            resolve(pktIn);
          }
        }
      };
      timeout = setTimeout(() => {
        this.off("packetreceived", listener);
        reject(new Error(`Timeout waiting response (waited for ${Utils.bufToHex(ids, ", ")})`));
      }, timeoutMs ?? 1e3);
      this.on("packetreceived", listener);
    });
  }
  /**
   * Convert raw bytes to packet objects and fire events. Defragmentation included.
   * @param data Bytes to process.
   */
  processRawPacket(data) {
    if (data.byteLength === 0) {
      return;
    }
    if (data instanceof DataView) {
      data = new Uint8Array(data.buffer);
    }
    this.packetBuf = Utils.u8ArrayAppend(this.packetBuf, data);
    if (this.packetBuf.length > 1 && !Utils.hasSubarrayAtPos(this.packetBuf, NiimbotPacket.HEAD, 0)) {
      console.warn("Dropping invalid buffer", Utils.bufToHex(this.packetBuf));
      this.packetBuf = new Uint8Array();
    }
    try {
      const packets = PacketParser.parsePacketBundle(this.packetBuf);
      if (packets.length > 0) {
        this.emit("rawpacketreceived", new RawPacketReceivedEvent(this.packetBuf));
        packets.forEach((p) => {
          this.emit("packetreceived", new PacketReceivedEvent(p));
        });
        this.packetBuf = new Uint8Array();
      }
    } catch (_e) {
      if (this.debug) {
        console.info(`Incomplete packet, ignoring:${Utils.bufToHex(this.packetBuf)}`, _e);
      }
    }
  }
  async sendPacket(packet, force) {
    await this.sendRaw(packet.toBytes(), force);
    this.emit("packetsent", new PacketSentEvent(packet));
  }
  /**
   * Send "connect" packet and fetch the protocol version.
   **/
  async initialNegotiate() {
    const cfg = this.info;
    cfg.connectResult = await this.abstraction.connectResult();
    cfg.protocolVersion = 0;
    if (cfg.connectResult === 2 /* ConnectedNew */) {
      cfg.protocolVersion = 1;
    } else if (cfg.connectResult === 3 /* ConnectedV3 */) {
      const statusData = await this.abstraction.getPrinterStatusData();
      cfg.protocolVersion = statusData.protocolVersion;
    }
  }
  /**
   * Fetches printer information and stores it.
   */
  async fetchPrinterInfo() {
    this.info.modelId = await this.abstraction.getPrinterModel();
    this.info.serial = await this.abstraction.getPrinterSerialNumber().catch(console.error) ?? void 0;
    this.info.mac = await this.abstraction.getPrinterBluetoothMacAddress().catch(console.error) ?? void 0;
    this.info.charge = await this.abstraction.getBatteryChargeLevel().catch(console.error) ?? void 0;
    this.info.autoShutdownTime = await this.abstraction.getAutoShutDownTime().catch(console.error) ?? void 0;
    this.info.labelType = await this.abstraction.getLabelType().catch(console.error) ?? void 0;
    this.info.hardwareVersion = await this.abstraction.getHardwareVersion().catch(console.error) ?? void 0;
    this.info.softwareVersion = await this.abstraction.getSoftwareVersion().catch(console.error) ?? void 0;
    this.emit("printerinfofetched", new PrinterInfoFetchedEvent(this.info));
    return this.info;
  }
  /**
   * Get the stored information about the printer.
   */
  getPrinterInfo() {
    return this.info;
  }
  /**
   * Set interval for {@link startHeartbeat}.
   *
   * @param intervalMs Heartbeat interval, default is 1000ms
   */
  setHeartbeatInterval(intervalMs) {
    this.heartbeatIntervalMs = intervalMs;
  }
  /**
   * Starts the heartbeat timer, "heartbeat" is emitted after packet received.
   *
   * If you need to change interval, call {@link setHeartbeatInterval} before.
   */
  startHeartbeat() {
    this.heartbeatFails = 0;
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.abstraction.heartbeat().then((data) => {
        this.heartbeatFails = 0;
        this.emit("heartbeat", new HeartbeatEvent(data));
      }).catch((e) => {
        console.error(e);
        this.heartbeatFails++;
        this.emit("heartbeatfailed", new HeartbeatFailedEvent(this.heartbeatFails));
      });
    }, this.heartbeatIntervalMs);
  }
  /**
   * Stops the heartbeat by clearing the interval timer.
   */
  stopHeartbeat() {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = void 0;
  }
  /**
   * Checks if the heartbeat timer has been started.
   */
  isHeartbeatStarted() {
    return this.heartbeatTimer === void 0;
  }
  /**
   * Get printer capabilities based on the printer model. Model library is hardcoded.
   **/
  getModelMetadata() {
    if (this.info.modelId === void 0) {
      return void 0;
    }
    return getPrinterMetaById(this.info.modelId);
  }
  /**
   * Determine print task version if any.
   **/
  getPrintTaskType() {
    const meta = this.getModelMetadata();
    if (meta === void 0) {
      return void 0;
    }
    return findPrintTask(meta.model, this.getPrinterInfo().protocolVersion);
  }
  /**
   * Set the interval between packets in milliseconds.
   */
  setPacketInterval(milliseconds) {
    this.packetIntervalMs = milliseconds;
  }
  /**
   * Enable some debug information logging.
   */
  setDebug(value) {
    this.debug = value;
  }
};

// src/client/bluetooth_impl.ts
var getAllModelFirstLetters = () => [...new Set(modelsLibrary.map((m) => m.model[0]))];
var BleDefaultConfiguration = class {
};
BleDefaultConfiguration.SERVICES = ["e7810a71-73ae-499d-8c15-faa9aef0c3f2"];
BleDefaultConfiguration.NAME_FILTERS = [
  ...getAllModelFirstLetters().map((l) => ({ namePrefix: l }))
];
var NiimbotBluetoothClient = class extends NiimbotAbstractClient {
  constructor() {
    super(...arguments);
    this.gattServer = void 0;
    this.channel = void 0;
    this.serviceUuidFilter = BleDefaultConfiguration.SERVICES;
  }
  getServiceUuidFilter() {
    return this.serviceUuidFilter;
  }
  setServiceUuidFilter(ids) {
    this.serviceUuidFilter = ids;
  }
  async connect() {
    await this.disconnect();
    const options = {
      filters: [
        ...BleDefaultConfiguration.NAME_FILTERS,
        { services: this.serviceUuidFilter ?? BleDefaultConfiguration.SERVICES }
      ]
    };
    const device = await navigator.bluetooth.requestDevice(options);
    if (device.gatt === void 0) {
      throw new Error("Device has no Bluetooth Generic Attribute Profile");
    }
    const disconnectListener = () => {
      this.gattServer = void 0;
      this.channel = void 0;
      this.info = {};
      this.emit("disconnect", new DisconnectEvent());
      device.removeEventListener("gattserverdisconnected", disconnectListener);
    };
    device.addEventListener("gattserverdisconnected", disconnectListener);
    const gattServer = await device.gatt.connect();
    const channel = await this.findSuitableBluetoothCharacteristic(
      gattServer
    );
    if (channel === void 0) {
      gattServer.disconnect();
      throw new Error("Suitable device characteristic not found");
    }
    console.log(`Found suitable characteristic ${channel.uuid}`);
    channel.addEventListener("characteristicvaluechanged", (event) => {
      const target = event.target;
      this.processRawPacket(target.value);
    });
    await channel.startNotifications();
    this.gattServer = gattServer;
    this.channel = channel;
    try {
      await this.initialNegotiate();
      await this.fetchPrinterInfo();
    } catch (e) {
      console.error("Unable to fetch printer info.");
      console.error(e);
    }
    const result = {
      deviceName: device.name,
      result: this.info.connectResult ?? 90 /* FirmwareErrors */
    };
    this.emit("connect", new ConnectEvent(result));
    return result;
  }
  async findSuitableBluetoothCharacteristic(gattServer) {
    const services = await gattServer.getPrimaryServices();
    for (const service of services) {
      if (service.uuid.length < 5) {
        continue;
      }
      const characteristics = await service.getCharacteristics();
      for (const c of characteristics) {
        if (c.properties.notify && c.properties.writeWithoutResponse) {
          return c;
        }
      }
    }
    return void 0;
  }
  isConnected() {
    return this.gattServer !== void 0 && this.channel !== void 0;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async disconnect() {
    this.stopHeartbeat();
    this.gattServer?.disconnect();
    this.gattServer = void 0;
    this.channel = void 0;
    this.info = {};
  }
  async sendRaw(data, force) {
    const send = async () => {
      if (this.channel === void 0) {
        throw new Error("Channel is closed");
      }
      await Utils.sleep(this.packetIntervalMs);
      await this.channel.writeValueWithoutResponse(data.buffer);
      this.emit("rawpacketsent", new RawPacketSentEvent(data));
    };
    if (force) {
      await send();
    } else {
      await this.mutex.runExclusive(send);
    }
  }
};

// build-shims/capacitor-ble.js
var BleClient = {};

// src/client/capacitor_ble_impl.ts
var NiimbotCapacitorBleClient = class extends NiimbotAbstractClient {
  async connect(options) {
    await this.disconnect();
    await BleClient.initialize({ androidNeverForLocation: true });
    const bluetoothEnabled = await BleClient.isEnabled();
    if (!bluetoothEnabled) {
      throw new Error("Bluetooth is not enabled");
    }
    let device;
    if (options?.deviceId !== void 0) {
      device = {
        deviceId: options.deviceId,
        name: options.deviceId
      };
    } else {
      device = await BleClient.requestDevice();
    }
    await BleClient.connect(device.deviceId, () => this.onBleDisconnect());
    await BleClient.discoverServices(device.deviceId);
    const { service, characteristic } = await this.findSuitableCharacteristic(device.deviceId).finally(
      () => this.onBleDisconnect()
    );
    this.deviceId = device.deviceId;
    this.serviceUUID = service;
    this.characteristicUUID = characteristic;
    if (this.debug) {
      console.log("Suitable channel found:", { service, characteristic });
    }
    await BleClient.startNotifications(this.deviceId, this.serviceUUID, this.characteristicUUID, (value) => {
      this.processRawPacket(value);
    });
    try {
      await this.initialNegotiate();
      await this.fetchPrinterInfo();
    } catch (e) {
      console.error("Unable to fetch printer info.");
      console.error(e);
    }
    const result = {
      deviceName: device.name,
      result: this.info.connectResult ?? 90 /* FirmwareErrors */
    };
    this.emit("connect", new ConnectEvent(result));
    return result;
  }
  async findSuitableCharacteristic(devId) {
    const services = await BleClient.getServices(devId);
    for (const service of services) {
      if (service.uuid.length < 5) {
        continue;
      }
      const characteristics = service.characteristics;
      for (const ch of characteristics) {
        if (ch.properties.notify && ch.properties.writeWithoutResponse) {
          return {
            characteristic: ch.uuid,
            service: service.uuid
          };
        }
      }
    }
    throw new Error("Unable to find suitable channel characteristic");
  }
  onBleDisconnect() {
    this.deviceId = void 0;
    this.serviceUUID = void 0;
    this.characteristicUUID = void 0;
    this.info = {};
    this.emit("disconnect", new DisconnectEvent());
  }
  isConnected() {
    return this.deviceId !== void 0;
  }
  async disconnect() {
    this.stopHeartbeat();
    if (this.deviceId !== void 0) {
      await BleClient.stopNotifications(this.deviceId, this.serviceUUID, this.characteristicUUID);
      await BleClient.disconnect(this.deviceId);
    }
    this.deviceId = void 0;
    this.info = {};
  }
  async sendRaw(data, force) {
    const send = async () => {
      if (!this.isConnected()) {
        throw new Error("Channel is closed");
      }
      await Utils.sleep(this.packetIntervalMs);
      const dw = new DataView(data.buffer, data.byteOffset, data.byteLength);
      await BleClient.writeWithoutResponse(this.deviceId, this.serviceUUID, this.characteristicUUID, dw);
      this.emit("rawpacketsent", new RawPacketSentEvent(data));
    };
    if (force) {
      await send();
    } else {
      await this.mutex.runExclusive(send);
    }
  }
};

// src/client/serial_impl.ts
var NiimbotSerialClient = class extends NiimbotAbstractClient {
  constructor() {
    super(...arguments);
    this.port = void 0;
    this.writer = void 0;
    this.reader = void 0;
  }
  async connect() {
    await this.disconnect();
    const _port = await navigator.serial.requestPort();
    _port.addEventListener("disconnect", () => {
      this.port = void 0;
      this.emit("disconnect", new DisconnectEvent());
    });
    await _port.open({ baudRate: 115200 });
    if (_port.readable === null) {
      throw new Error("Port is not readable");
    }
    if (_port.writable === null) {
      throw new Error("Port is not writable");
    }
    this.port = _port;
    const info = _port.getInfo();
    this.writer = _port.writable.getWriter();
    this.reader = _port.readable.getReader();
    setTimeout(() => {
      void (async () => {
        await this.waitSerialData();
      })();
    }, 1);
    try {
      await this.initialNegotiate();
      await this.fetchPrinterInfo();
    } catch (e) {
      console.error("Unable to fetch printer info (is it turned on?).");
      console.error(e);
    }
    const result = {
      deviceName: `Serial (VID:${info.usbVendorId?.toString(16)} PID:${info.usbProductId?.toString(16)})`,
      result: this.info.connectResult ?? 90 /* FirmwareErrors */
    };
    this.emit("connect", new ConnectEvent(result));
    return result;
  }
  async waitSerialData() {
    while (true) {
      try {
        const result = await this.reader.read();
        if (result.value) {
          if (this.debug) {
            console.info(`<< serial chunk ${Utils.bufToHex(result.value)}`);
          }
          this.processRawPacket(result.value);
        }
        if (result.done) {
          console.log("done");
          break;
        }
      } catch (_e) {
        break;
      }
    }
  }
  async disconnect() {
    this.stopHeartbeat();
    if (this.writer !== void 0) {
      this.writer.releaseLock();
    }
    if (this.reader !== void 0) {
      this.reader.releaseLock();
    }
    if (this.port !== void 0) {
      await this.port.close();
      this.emit("disconnect", new DisconnectEvent());
    }
    this.port = void 0;
    this.writer = void 0;
  }
  isConnected() {
    return this.port !== void 0 && this.writer !== void 0 && this.reader !== void 0;
  }
  async sendRaw(data, force) {
    const send = async () => {
      if (!this.isConnected()) {
        throw new Error("Port is not readable/writable");
      }
      await Utils.sleep(this.packetIntervalMs);
      await this.writer.write(data);
      this.emit("rawpacketsent", new RawPacketSentEvent(data));
    };
    if (force) {
      await send();
    } else {
      await this.mutex.runExclusive(send);
    }
  }
};

// src/client/uniapp_ble_impl.ts
var NiimbotUniAppBleClient = class extends NiimbotAbstractClient {
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
        fail: (err) => reject(new Error(`openBluetoothAdapter failed: ${err.errMsg}`))
      });
    });
    let deviceId;
    let deviceName;
    if (options?.deviceId !== void 0) {
      deviceId = options.deviceId;
      deviceName = options.deviceName ?? options.deviceId;
    } else {
      const device = await this.scanForDevice(options?.scanTimeoutMs ?? 15e3);
      deviceId = device.deviceId;
      deviceName = device.name ?? deviceId;
    }
    await new Promise((resolve, reject) => {
      uni.createBLEConnection({
        deviceId,
        success: () => resolve(),
        fail: (err) => reject(new Error(`createBLEConnection failed: ${err.errMsg}`))
      });
    });
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    uni.onBLEConnectionStateChange(this.onConnectionStateChange);
    try {
      const mtuRes = await new Promise((resolve, reject) => {
        uni.setBLEMTU({
          deviceId,
          mtu: 512,
          success: (res) => resolve(res),
          fail: () => reject()
        });
      });
      this.mtu = mtuRes.mtu - 3;
    } catch {
    }
    await Utils.sleep(500);
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
        fail: (err) => reject(new Error(`notifyBLECharacteristicValueChange failed: ${err.errMsg}`))
      });
    });
    uni.onBLECharacteristicValueChange(this.onCharacteristicValueChange);
    try {
      await this.initialNegotiate();
      await this.fetchPrinterInfo();
    } catch (e) {
      console.error("Unable to fetch printer info.");
      console.error(e);
    }
    const result = {
      deviceName: this.deviceName,
      result: this.info.connectResult ?? 90 /* FirmwareErrors */
    };
    this.emit("connect", new ConnectEvent(result));
    return result;
  }
  scanForDevice(timeoutMs) {
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
          const serviceUuids = (device.advertisServiceUUIDs ?? []).map((u) => u.toLowerCase());
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
        success: () => {
        },
        fail: (err) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            typeof uni.offBluetoothDeviceFound === "function" && uni.offBluetoothDeviceFound();
            reject(new Error(`startBluetoothDevicesDiscovery failed: ${err.errMsg}`));
          }
        }
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
        fail: (err) => reject(new Error(`getBLEDeviceServices failed: ${err.errMsg}`))
      });
    });
    console.log("[niimblue] discovered services:", servicesRes.services.map((s) => s.uuid));
    for (const service of servicesRes.services) {
      if (service.uuid.length < 5) continue;
      const charsRes = await new Promise((resolve, reject) => {
        uni.getBLEDeviceCharacteristics({
          deviceId,
          serviceId: service.uuid,
          success: (res) => resolve(res),
          fail: (err) => reject(new Error(`getBLEDeviceCharacteristics failed: ${err.errMsg}`))
        });
      });
      for (const ch of charsRes.characteristics) {
        const p = ch.properties;
        console.log("[niimblue] char:", ch.uuid, "props:", JSON.stringify(p));
        const canNotify = p.notify || p.indicate;
        const canWrite = p.writeNoResponse || p.writeDefault || p.write;
        if (canNotify && canWrite) {
          console.log("[niimblue] selected:", service.uuid, ch.uuid);
          return { serviceId: service.uuid, characteristicId: ch.uuid };
        }
      }
    }
    throw new Error("No suitable BLE characteristic found");
  }
  onBleDisconnect() {
    typeof uni.offBLEConnectionStateChange === "function" && uni.offBLEConnectionStateChange(this.onConnectionStateChange);
    typeof uni.offBLECharacteristicValueChange === "function" && uni.offBLECharacteristicValueChange(this.onCharacteristicValueChange);
    this.deviceId = void 0;
    this.serviceId = void 0;
    this.characteristicId = void 0;
    this.deviceName = void 0;
    this.info = {};
    this.emit("disconnect", new DisconnectEvent());
  }
  isConnected() {
    return this.deviceId !== void 0;
  }
  async disconnect() {
    this.stopHeartbeat();
    if (this.deviceId !== void 0) {
      try {
        await new Promise((resolve) => {
          uni.closeBLEConnection({
            deviceId: this.deviceId,
            success: () => resolve(),
            fail: () => resolve()
          });
        });
      } catch {
      }
    }
    typeof uni.offBLEConnectionStateChange === "function" && uni.offBLEConnectionStateChange(this.onConnectionStateChange);
    typeof uni.offBLECharacteristicValueChange === "function" && uni.offBLECharacteristicValueChange(this.onCharacteristicValueChange);
    this.deviceId = void 0;
    this.serviceId = void 0;
    this.characteristicId = void 0;
    this.deviceName = void 0;
    this.info = {};
  }
  async sendRaw(data, force) {
    const send = async () => {
      if (!this.isConnected()) {
        throw new Error("Channel is closed");
      }
      await Utils.sleep(this.packetIntervalMs);
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
            fail: (err) => reject(new Error(`writeBLECharacteristicValue failed: ${err.errMsg}`))
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
};

// src/client/index.ts
var instantiateClient = (t) => {
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
  AbstractPrintTask,
  Abstraction,
  AutoShutdownTime,
  B1PrintTask,
  B21V1PrintTask,
  BatteryChargeLevel,
  ConnectEvent,
  ConnectResult,
  D110MV4PrintTask,
  D110PrintTask,
  DisconnectEvent,
  FirmwareProgressEvent,
  HeartbeatEvent,
  HeartbeatFailedEvent,
  HeartbeatType,
  ImageEncoder,
  LabelType,
  NIIMBOT_CLIENT_DEFAULTS,
  NiimbotAbstractClient,
  NiimbotBluetoothClient,
  NiimbotCapacitorBleClient,
  NiimbotCrc32Packet,
  NiimbotEvent,
  NiimbotPacket,
  NiimbotSerialClient,
  NiimbotUniAppBleClient,
  OldD11PrintTask,
  PacketGenerator,
  PacketParser,
  PacketReceivedEvent,
  PacketSentEvent,
  PrintError,
  PrintProgressEvent,
  PrinterErrorCode,
  PrinterInfoFetchedEvent,
  PrinterInfoType,
  PrinterModel,
  RawPacketReceivedEvent,
  RawPacketSentEvent,
  RequestCommandId,
  ResponseCommandId2 as ResponseCommandId,
  SequentialDataReader,
  SoundSettingsItemType,
  SoundSettingsType,
  Utils,
  Validators,
  commandsMap,
  findPrintTask,
  firmwareExchangePackets,
  getPrinterMetaById,
  getPrinterMetaByModel,
  instantiateClient,
  modelPrintTasks,
  modelsLibrary,
  printTaskNames,
  printTasks
};
/*! Bundled license information:

crc-32/crc32.js:
  (*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com *)
*/
