/**
 * Specialized storage for Opposer Server Context.
 * Manages global application state like database connections and model definitions.
 */
class ServerContext {
  private static instance: ServerContext;
  private data: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): ServerContext {
    if (!ServerContext.instance) {
      ServerContext.instance = new ServerContext();
    }
    return ServerContext.instance;
  }

  set<T>(key: string, value: T): void {
    this.data.set(key, value);
  }

  get<T>(key: string): T {
    return this.data.get(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  delete(key: string): boolean {
    return this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

export default ServerContext.getInstance();
