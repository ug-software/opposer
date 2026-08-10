import type { Request, Response } from '../interfaces/server.js';
import type { Transport } from './types.js';
export declare const STREAM_CONTENT_TYPE = "application/x-ndjson";
export declare class StreamTransport implements Transport {
    readonly name: "stream";
    readonly contentType = "application/x-ndjson; charset=utf-8";
    matches(req: Request): boolean;
    send(_req: Request, res: Response, data: unknown): void;
}
declare const _default: StreamTransport;
export default _default;
