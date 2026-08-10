import type { Request, Response } from '../interfaces/server.js';
import type { Transport } from './types.js';

export class JsonTransport implements Transport {
  readonly name = 'json' as const;
  readonly contentType = 'application/json; charset=utf-8';

  matches() {
    return true;
  }

  send(_req: Request, res: Response, data: unknown) {
    if (res.writableEnded) return;
    res.setHeader('Content-Type', this.contentType);
    res.end(JSON.stringify(data));
  }
}

export default new JsonTransport();
