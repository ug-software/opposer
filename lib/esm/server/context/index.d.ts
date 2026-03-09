/**
 * Specialized storage for Opposer Server Context.
 * Manages global application state like database connections and model definitions.
 */
declare class ServerContext {
    private static instance;
    private data;
    private constructor();
    static getInstance(): ServerContext;
    set<T>(key: string, value: T): void;
    get<T>(key: string): T;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
}
declare const _default: ServerContext;
export default _default;
