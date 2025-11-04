import system from "../system/index.js";
import Storage from "./storage.js";
import Store from "./store.js";
export default new (class Global extends Storage {
    constructor() {
        super();
        this.__settings = system.settings.cache.global;
        this.__data = new Store();
        this.__data.setSettings(system.settings.cache.global);
    }
    set(key, value) {
        this.__data.set(key, value);
    }
    get(key) {
        return this.__data.get(key);
    }
})().configure();
