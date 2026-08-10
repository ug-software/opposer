import type { Request } from '../interfaces/server.js';
import type { Transport, TransportName } from './types.js';
export type { Transport, TransportName } from './types.js';
export { JsonTransport } from './json.js';
export { StreamTransport, STREAM_CONTENT_TYPE } from './stream.js';
export declare const transports: Record<TransportName, Transport>;
export declare function resolveTransport(req: Request, enabled: TransportName[]): Transport | undefined;
