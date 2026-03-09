/**
 * Especialized storage for Opposer Core Context.
 * Uses GlobalStorage internally but provides a clean Singleton interface
 * for the server engine and public consumption.
 */
declare class ContextStorage {
    private static instance;
    private readonly namespace;
    private constructor();
    static getInstance(): ContextStorage;
    set<T>(key: string, value: T): void;
    get<T>(key: string): T;
    has(key: string): boolean;
    clear(): void;
}
declare const _default: ContextStorage;
export default _default;
