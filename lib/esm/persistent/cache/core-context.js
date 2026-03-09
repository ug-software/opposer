import GlobalStorage from "../cache/global.js";
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
        const data = GlobalStorage.get(this.namespace) || {};
        data[key] = value;
        GlobalStorage.set(this.namespace, data);
    }
    get(key) {
        const data = GlobalStorage.get(this.namespace) || {};
        return data[key];
    }
    has(key) {
        const data = GlobalStorage.get(this.namespace) || {};
        return Object.prototype.hasOwnProperty.call(data, key);
    }
    clear() {
        GlobalStorage.set(this.namespace, {});
    }
}
export default ContextStorage.getInstance();
