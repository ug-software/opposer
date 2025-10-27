import { TimerUnit, type CacheSettings } from "../interfaces/system.js";
import timer from "../utils/timer.js";
import system from "../system/index.js";
import Store from "./store.js";
import memory from "../utils/memory.js";

export default class Storage {
  __settings!: CacheSettings;
  __data: Record<string, any> = {};
  __isMaxSizeMemory: boolean = false;
  __currentSizeMemory: number = 0;

  snapshot() {}

  restore() {}

  size() {
    this.__currentSizeMemory = memory.roughSizeOfObject(this.__data);
    this.__isMaxSizeMemory =
      this.__currentSizeMemory ===
      memory.toBytes(
        this.__settings.maxmemory.size,
        this.__settings.maxmemory.unit
      );

    return this.__isMaxSizeMemory;
  }

  revalidate() {
    if(this.__data instanceof Store){
      this.__data.clearMemoryForPolicy();

      var __isMaxSizeMemory = this.size();
      if (__isMaxSizeMemory) {
        return this.notifyStoresForClearMemoryPerPolicy();
      }

      return null;
    }

    var creared = Object.keys(this.__data).reduce((data, key) => {
      var store = this.__data[key] as Store;
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
    Object.values(this.__data).forEach((store: Store) =>
      store.clearMemoryForPolicy()
    );

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
    if (system.settings.cache.type === "persistent") {
      if (system.settings.cache.snapshot.active) {
        setInterval(() => {
          this.snapshot();
        }, system.settings.cache.snapshot.timer * timer.msPerUnit[system.settings.cache.snapshot.unit]);
      }

      this.restore();
    }

    setInterval(() => {
      this.revalidate();
    }, timer.getSeconds(this.__settings.revalidate.timer, this.__settings.revalidate.unit));

    return this;
  }
}
