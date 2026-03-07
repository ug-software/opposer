"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("../context/index.js"));
const storage_js_1 = __importDefault(require("./storage.js"));
const store_js_1 = __importDefault(require("./store.js"));
exports.default = new (class Session extends storage_js_1.default {
    createStore(sessionId) {
        const store = new store_js_1.default(sessionId);
        Object.defineProperty(this.__data, sessionId, {
            value: store,
            writable: true,
            enumerable: true,
            configurable: true,
        });
        return store;
    }
    loadStore(sessionId) {
        const store = this.__data[sessionId];
        if (!store) {
            if (this.__isMaxSizeMemory) {
                return null;
            }
            return this.createStore(sessionId);
        }
        store.revalidateTimer();
        return store;
    }
    initialize(req, res, next) {
        const sessionId = req.headers["session-opposer-id"];
        const store = this.loadStore(sessionId);
        if (!sessionId) {
            return res.status(401);
        }
        index_js_1.default.run({ store, sessionId }, next);
    }
})().configure();
