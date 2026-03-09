import type { Request, Response, NextFunction } from "express";
import Store from "./store.js";
declare const _default: {
    createStore(sessionId: string): Store;
    loadStore(sessionId: string): Store | null;
    initialize(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    __settings: import("../interfaces/system.js").CacheSettings;
    __data: Record<string, any>;
    __isMaxSizeMemory: boolean;
    __currentSizeMemory: number;
    snapshot(): void;
    restore(): void;
    size(): boolean;
    revalidate(): void | null;
    notifyStoresForClearMemoryPerPolicy(): void;
    clear(): void;
    configure(): /*elided*/ any;
};
export default _default;
