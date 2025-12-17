"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timer_js_1 = __importDefault(require("../utils/timer.js"));
const index_js_1 = __importDefault(require("../system/index.js"));
const store_js_1 = __importDefault(require("./store.js"));
const memory_js_1 = __importDefault(require("../utils/memory.js"));
class Storage {
    constructor() {
        this.__data = {};
        this.__isMaxSizeMemory = false;
        this.__currentSizeMemory = 0;
    }
    snapshot() { }
    restore() { }
    size() {
        this.__currentSizeMemory = memory_js_1.default.roughSizeOfObject(this.__data);
        this.__isMaxSizeMemory =
            this.__currentSizeMemory ===
                memory_js_1.default.toBytes(this.__settings.maxmemory.size, this.__settings.maxmemory.unit);
        return this.__isMaxSizeMemory;
    }
    revalidate() {
        if (this.__data instanceof store_js_1.default) {
            this.__data.clearMemoryForPolicy();
            var __isMaxSizeMemory = this.size();
            if (__isMaxSizeMemory) {
                return this.notifyStoresForClearMemoryPerPolicy();
            }
            return null;
        }
        var creared = Object.keys(this.__data).reduce((data, key) => {
            var store = this.__data[key];
            if (store.isValid()) {
                Object.defineProperty(data, key, {
                    value: store,
                    configurable: true,
                    enumerable: true,
                    writable: true,
                });
            }
            return data;
        }, {});
        Object.defineProperty(this, "__data", {
            value: creared,
            configurable: true,
            enumerable: true,
            writable: true,
        });
        var __isMaxSizeMemory = this.size();
        if (__isMaxSizeMemory) {
            return this.notifyStoresForClearMemoryPerPolicy();
        }
        return null;
    }
    notifyStoresForClearMemoryPerPolicy() {
        Object.values(this.__data).forEach((store) => store.clearMemoryForPolicy());
        var __isMaxSizeMemory = this.size();
        if (__isMaxSizeMemory) {
            this.notifyStoresForClearMemoryPerPolicy();
        }
    }
    clear() {
        Object.defineProperty(this, "__data", {
            value: {},
            configurable: true,
            enumerable: true,
            writable: true,
        });
    }
    configure() {
        if (index_js_1.default.settings.cache.type === "persistent") {
            if (index_js_1.default.settings.cache.snapshot.active) {
                setInterval(() => {
                    this.snapshot();
                }, index_js_1.default.settings.cache.snapshot.timer * timer_js_1.default.msPerUnit[index_js_1.default.settings.cache.snapshot.unit]);
            }
            this.restore();
        }
        setInterval(() => {
            this.revalidate();
        }, timer_js_1.default.getSeconds(this.__settings.revalidate.timer, this.__settings.revalidate.unit));
        return this;
    }
}
exports.default = Storage;
