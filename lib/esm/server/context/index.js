/**
 * Specialized storage for Opposer Server Context.
 * Manages global application state like database connections and model definitions.
 */
class ServerContext {
    constructor() {
        this.data = new Map();
    }
    static getInstance() {
        if (!ServerContext.instance) {
            ServerContext.instance = new ServerContext();
        }
        return ServerContext.instance;
    }
    set(key, value) {
        this.data.set(key, value);
    }
    get(key) {
        return this.data.get(key);
    }
    has(key) {
        return this.data.has(key);
    }
    delete(key) {
        return this.data.delete(key);
    }
    clear() {
        this.data.clear();
    }
}
export default ServerContext.getInstance();
