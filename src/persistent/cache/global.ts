import type { CacheSettings } from "../interfaces/system.js";
import system from "../system/index.js";
import Storage from "./storage.js";
import Store from "./store.js";

export default new (class Global extends Storage {
  __settings = system.settings.cache.global;
  __data = new Store();

  constructor(){
    super();
    this.__data.setSettings(system.settings.cache.global)
  }

  set(key: string, value: any){
    this.__data.set(key, value);
  }

  get(key: string){
    return this.__data.get(key);
  }
})().configure();
