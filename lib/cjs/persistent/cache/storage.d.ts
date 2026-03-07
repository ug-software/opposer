import { type CacheSettings } from "../interfaces/system.js";
export default class Storage {
    __settings: CacheSettings;
    __data: Record<string, any>;
    __isMaxSizeMemory: boolean;
    __currentSizeMemory: number;
    snapshot(): void;
    restore(): void;
    size(): boolean;
    revalidate(): void | null;
    notifyStoresForClearMemoryPerPolicy(): void;
    clear(): void;
    configure(): this;
}
