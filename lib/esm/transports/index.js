import jsonTransport from './json.js';
import streamTransport from './stream.js';
export { JsonTransport } from './json.js';
export { StreamTransport, STREAM_CONTENT_TYPE } from './stream.js';
export const transports = { json: jsonTransport, stream: streamTransport };
export function resolveTransport(req, enabled) {
    if (enabled.includes('stream') && streamTransport.matches(req))
        return streamTransport;
    if (enabled.includes('json'))
        return jsonTransport;
    return undefined;
}
