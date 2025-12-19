"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timer_js_1 = __importDefault(require("../utils/timer.js"));
class Store {
    constructor(session) {
        this.__expires_in = timer_js_1.default.getNextSessionExpireDate();
        this.__data = new Map();
        this.__meta = new Map();
        this.__sessionId = session;
    }
    // Marca o acesso e frequência (para LFU/LRU)
    trackAccess(key) {
        if (!this.__meta.has(key)) {
            this.__meta.set(key, {
                lastAccess: Date.now(),
                frequency: 1,
                ttl: undefined,
            });
        }
        else {
            var __meta = this.__meta.get(key);
            if (!__meta) {
                return;
            }
            __meta.lastAccess = Date.now();
            __meta.frequency++;
        }
    }
    get(key) {
        const value = this.__data.get(key);
        if (value !== undefined) {
            this.trackAccess(key);
        }
        return value;
    }
    set(key, value, ttlMs) {
        this.__data.set(key, value);
        this.__meta.set(key, {
            lastAccess: Date.now(),
            frequency: 1,
            ttl: ttlMs ? Date.now() + ttlMs : undefined,
        });
    }
    revalidateTimer() {
        this.__expires_in = timer_js_1.default.getNextSessionExpireDate();
    }
    isValid() {
        return this.__expires_in > new Date().getTime();
    }
    // Políticas de limpeza
    clearMemoryForPolicy() {
        const policy = this.__settings.evictionPolicy;
        switch (policy) {
            // Nenhuma exclusão automática
            case "noeviction":
                return;
            // Remove o menos recentemente usado
            case "volatile-lru": {
                let oldestKey = null;
                let oldestAccess = Infinity;
                for (const [key, meta] of Object.entries(this.__meta)) {
                    if (meta.lastAccess < oldestAccess) {
                        oldestAccess = meta.lastAccess;
                        oldestKey = key;
                    }
                }
                if (oldestKey) {
                    this.__data.delete(oldestKey);
                    this.__meta.delete(oldestKey);
                }
                break;
            }
            // Remove o menos frequentemente usado
            case "volatile-lfu": {
                let leastUsedKey = null;
                let leastFrequency = Infinity;
                for (const [key, meta] of Object.entries(this.__meta)) {
                    if (meta.frequency < leastFrequency) {
                        leastUsedKey = key;
                        leastFrequency = meta.frequency;
                    }
                }
                if (leastUsedKey) {
                    this.__data.delete(leastUsedKey);
                    this.__meta.delete(leastUsedKey);
                }
                break;
            }
            // Remove chaves que passaram do TTL
            case "volatile-ttl": {
                const now = Date.now();
                for (const [key, meta] of Object.entries(this.__meta)) {
                    if (meta.ttl && meta.ttl < now) {
                        this.__data.delete(key);
                        this.__meta.delete(key);
                    }
                }
                break;
            }
            default:
                console.warn(`[Store] Unknown eviction policy: ${policy}`);
                break;
        }
    }
    setSettings(settings) {
        this.__settings = settings;
    }
}
exports.default = Store;
