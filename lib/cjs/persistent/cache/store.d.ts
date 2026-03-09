import type { CacheSettings } from "../interfaces/system.js";
export default class Store {
    private __sessionId;
    private __settings;
    private __expires_in;
    private __data;
    private __meta;
    constructor(session?: string);
    private trackAccess;
    get(key: string): any;
    set(key: string, value: any, ttlMs?: number): void;
    revalidateTimer(): void;
    isValid(): boolean;
    clearMemoryForPolicy(): void;
    setSettings(settings: CacheSettings): void;
}
