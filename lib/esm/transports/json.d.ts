import type { Request, Response } from '../interfaces/server.js';
import type { Transport } from './types.js';
export declare class JsonTransport implements Transport {
    readonly name: "json";
    readonly contentType = "application/json; charset=utf-8";
    matches(): boolean;
    send(_req: Request, res: Response, data: unknown): void;
}
declare const _default: JsonTransport;
export default _default;
