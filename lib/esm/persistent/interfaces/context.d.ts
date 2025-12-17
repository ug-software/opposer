import type { Store } from "../cache/index.js";
export interface ContextSession {
    sessionId: string;
    store: Store;
}
