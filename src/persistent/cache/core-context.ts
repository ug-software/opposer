import GlobalStorage from "../cache/global.js";

/**
 * Especialized storage for Opposer Core Context.
 * Uses GlobalStorage internally but provides a clean Singleton interface
 * for the server engine and public consumption.
 */
class ContextStorage {
  private static instance: ContextStorage;
  private readonly namespace = "opposer:core:context";

  private constructor() {}

  static getInstance(): ContextStorage {
    if (!ContextStorage.instance) {
      ContextStorage.instance = new ContextStorage();
    }
    return ContextStorage.instance;
  }

  set<T>(key: string, value: T): void {
    const data = GlobalStorage.get(this.namespace) || {};
    data[key] = value;
    GlobalStorage.set(this.namespace, data);
  }

  get<T>(key: string): T {
    const data = GlobalStorage.get(this.namespace) || {};
    return data[key];
  }

  has(key: string): boolean {
    const data = GlobalStorage.get(this.namespace) || {};
    return Object.prototype.hasOwnProperty.call(data, key);
  }

  clear(): void {
    GlobalStorage.set(this.namespace, {});
  }
}

export default ContextStorage.getInstance();
