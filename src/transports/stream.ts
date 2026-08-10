import type { Request, Response } from '../interfaces/server.js';
import type { Transport } from './types.js';

export const STREAM_CONTENT_TYPE = 'application/x-ndjson';

export class StreamTransport implements Transport {
  readonly name = 'stream' as const;
  readonly contentType = `${STREAM_CONTENT_TYPE}; charset=utf-8`;

  matches(req: Request) {
    const requestedTransport = req.headers['x-opposer-transport'];
    const accept = req.headers.accept || '';
    return requestedTransport === 'stream' || accept.split(',').some((type) => type.trim().startsWith(STREAM_CONTENT_TYPE));
  }

  send(_req: Request, res: Response, data: unknown) {
    if (res.writableEnded) return;
    res.setHeader('Content-Type', this.contentType);
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Vary', 'Accept, x-opposer-transport');
    res.flushHeaders?.();

    const values = Array.isArray(data) ? data : [data];
    const event = res.statusCode >= 400 ? 'error' : 'data';
    for (const value of values) {
      res.write(`${JSON.stringify({ event, data: value })}\n`);
    }
    res.end(`${JSON.stringify({ event: 'end', count: values.length })}\n`);
  }
}

export default new StreamTransport();
