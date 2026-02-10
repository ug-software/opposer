"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("../system/index.js"));
const storage_js_1 = __importDefault(require("./storage.js"));
const store_js_1 = __importDefault(require("./store.js"));
exports.default = new (class Global extends storage_js_1.default {
    constructor() {
        super();
        this.__settings = index_js_1.default.settings.cache.global;
        this.__data = new store_js_1.default();
        this.__data.setSettings(index_js_1.default.settings.cache.global);
    }
    set(key, value) {
        this.__data.set(key, value);
    }
    get(key) {
        return this.__data.get(key);
    }
})().configure();
