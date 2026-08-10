import jsonTransport from './json.js';
import streamTransport from './stream.js';
import type { Request } from '../interfaces/server.js';
import type { Transport, TransportName } from './types.js';

export type { Transport, TransportName } from './types.js';
export { JsonTransport } from './json.js';
export { StreamTransport, STREAM_CONTENT_TYPE } from './stream.js';

export const transports: Record<TransportName, Transport> = { json: jsonTransport, stream: streamTransport };

export function resolveTransport(req: Request, enabled: TransportName[]): Transport | undefined {
  if (enabled.includes('stream') && streamTransport.matches(req)) return streamTransport;
  if (enabled.includes('json')) return jsonTransport;
  return undefined;
}
