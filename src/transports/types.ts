import type { Request, Response } from '../interfaces/server.js';

export type TransportName = 'json' | 'stream';

export interface Transport {
  readonly name: TransportName;
  readonly contentType: string;
  matches(req: Request): boolean;
  send(req: Request, res: Response, data: unknown): void;
}
