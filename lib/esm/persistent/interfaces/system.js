export var MemoryUnit;
(function (MemoryUnit) {
    MemoryUnit["MB"] = "mb";
    MemoryUnit["GB"] = "gb";
})(MemoryUnit || (MemoryUnit = {}));
export var TimerUnit;
(function (TimerUnit) {
    TimerUnit["seconds"] = "seconds";
    TimerUnit["minutes"] = "minutes";
    TimerUnit["hours"] = "hours";
    TimerUnit["days"] = "days";
})(TimerUnit || (TimerUnit = {}));
export var EvictionPolicy;
(function (EvictionPolicy) {
    EvictionPolicy["noeviction"] = "noeviction";
    EvictionPolicy["volatileLru"] = "volatile-lru";
    EvictionPolicy["allkeysLru"] = "allkeys-lru";
    EvictionPolicy["volatileLfu"] = "volatile-lfu";
    EvictionPolicy["allkeysLfu"] = "allkeys-lfu";
    EvictionPolicy["volatileTtl"] = "volatile-ttl";
})(EvictionPolicy || (EvictionPolicy = {}));
export var CacheType;
(function (CacheType) {
    CacheType["inMemory"] = "in-memory";
    CacheType["persistent"] = "persistent";
})(CacheType || (CacheType = {}));
