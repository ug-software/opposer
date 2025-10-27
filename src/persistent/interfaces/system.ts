export enum MemoryUnit {
  MB = "mb",
  GB = "gb",
}

export enum TimerUnit {
  seconds = "seconds",
  minutes = "minutes",
  hours = "hours",
  days = "days",
}

export enum EvictionPolicy {
  noeviction = "noeviction",
  volatileLru = "volatile-lru",
  allkeysLru = "allkeys-lru",
  volatileLfu = "volatile-lfu",
  allkeysLfu = "allkeys-lfu",
  volatileTtl = "volatile-ttl",
}

export enum CacheType {
  inMemory = "in-memory",
  persistent = "persistent",
}

export interface CacheSettings {
  expire: number;
  unit: TimerUnit;
  evictionPolicy: EvictionPolicy;
  maxmemory: {
    size: number;
    unit: MemoryUnit;
  };
  revalidate: {
    timer: number;
    unit: TimerUnit;
  };
}

export interface OpposerSystemConfigOptions {
  cache: {
    type: CacheType;
    snapshot: {
      active: boolean;
      timer: number;
      unit: TimerUnit;
    };
    session: CacheSettings;
    global: CacheSettings;
  };
}
