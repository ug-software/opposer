"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheType = exports.EvictionPolicy = exports.TimerUnit = exports.MemoryUnit = void 0;
var MemoryUnit;
(function (MemoryUnit) {
    MemoryUnit["MB"] = "mb";
    MemoryUnit["GB"] = "gb";
})(MemoryUnit || (exports.MemoryUnit = MemoryUnit = {}));
var TimerUnit;
(function (TimerUnit) {
    TimerUnit["seconds"] = "seconds";
    TimerUnit["minutes"] = "minutes";
    TimerUnit["hours"] = "hours";
    TimerUnit["days"] = "days";
})(TimerUnit || (exports.TimerUnit = TimerUnit = {}));
var EvictionPolicy;
(function (EvictionPolicy) {
    EvictionPolicy["noeviction"] = "noeviction";
    EvictionPolicy["volatileLru"] = "volatile-lru";
    EvictionPolicy["allkeysLru"] = "allkeys-lru";
    EvictionPolicy["volatileLfu"] = "volatile-lfu";
    EvictionPolicy["allkeysLfu"] = "allkeys-lfu";
    EvictionPolicy["volatileTtl"] = "volatile-ttl";
})(EvictionPolicy || (exports.EvictionPolicy = EvictionPolicy = {}));
var CacheType;
(function (CacheType) {
    CacheType["inMemory"] = "in-memory";
    CacheType["persistent"] = "persistent";
})(CacheType || (exports.CacheType = CacheType = {}));
