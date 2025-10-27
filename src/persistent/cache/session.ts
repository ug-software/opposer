import type { Request, Response, NextFunction } from "express";
import context from "../context/index.js";
import Storage from "./storage.js";
import Store from "./store.js";

export default new (class Session extends Storage {
  createStore(sessionId: string): Store {
    const store = new Store(sessionId);

    Object.defineProperty(this.__data, sessionId, {
      value: store,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    return store;
  }

  loadStore(sessionId: string) {
    const store = this.__data[sessionId] as Store;
    if (!store) {
      if (this.__isMaxSizeMemory) {
        return null;
      }

      return this.createStore(sessionId);
    }

    store.revalidateTimer();
    return store;
  }

  initialize(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.headers["session-opposer-id"] as string;
    const store = this.loadStore(sessionId);

    if (!sessionId) {
      return res.status(401);
    }

    context.run({ store, sessionId }, next);
  }
})().configure();
