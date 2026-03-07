import context from "../context/index.js";
import Storage from "./storage.js";
import Store from "./store.js";
export default new (class Session extends Storage {
    createStore(sessionId) {
        const store = new Store(sessionId);
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
        context.run({ store, sessionId }, next);
    }
})().configure();
