import type { CacheSettings } from "../interfaces/system.js";
import Store from "./store.js";
declare const _default: {
    __settings: CacheSettings;
    __data: Store;
    set(key: string, value: any): void;
    get(key: string): any;
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
