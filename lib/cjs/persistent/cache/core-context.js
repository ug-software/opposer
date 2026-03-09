"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_js_1 = __importDefault(require("../cache/global.js"));
/**
 * Especialized storage for Opposer Core Context.
 * Uses GlobalStorage internally but provides a clean Singleton interface
 * for the server engine and public consumption.
 */
class ContextStorage {
    constructor() {
        this.namespace = "opposer:core:context";
    }
    static getInstance() {
        if (!ContextStorage.instance) {
            ContextStorage.instance = new ContextStorage();
        }
        return ContextStorage.instance;
    }
    set(key, value) {
        const data = global_js_1.default.get(this.namespace) || {};
        data[key] = value;
        global_js_1.default.set(this.namespace, data);
    }
    get(key) {
        const data = global_js_1.default.get(this.namespace) || {};
        return data[key];
    }
    has(key) {
        const data = global_js_1.default.get(this.namespace) || {};
        return Object.prototype.hasOwnProperty.call(data, key);
    }
    clear() {
        global_js_1.default.set(this.namespace, {});
    }
}
exports.default = ContextStorage.getInstance();
