import { afterEach, describe, expect, test } from 'vitest';
import type { AddressInfo } from 'node:net';
import type { Server as HttpServer } from 'node:http';
import { OpposerServer } from '../../src/server/core/index.js';

const openServers: HttpServer[] = [];

afterEach(async () => {
  await Promise.all(openServers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

async function createUrl(server: OpposerServer) {
  server.use((_req, res) => res.status(200).json([{ id: 1 }, { id: 2 }]));
  const httpServer = server.listen(0);
  openServers.push(httpServer);
  await new Promise<void>((resolve) => httpServer.once('listening', resolve));
  const address = httpServer.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}/opposer`;
}

describe('Response transports', () => {
  test('uses JSON by default', async () => {
    const url = await createUrl(new OpposerServer());
    const response = await fetch(url);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('streams one NDJSON event per array item when requested', async () => {
    const url = await createUrl(new OpposerServer());
    const response = await fetch(url, { headers: { Accept: 'application/x-ndjson' } });
    const lines = (await response.text()).trim().split('\n').map(JSON.parse);
    expect(response.headers.get('content-type')).toContain('application/x-ndjson');
    expect(lines).toEqual([
      { event: 'data', data: { id: 1 } },
      { event: 'data', data: { id: 2 } },
      { event: 'end', count: 2 },
    ]);
  });

  test('can disable the stream transport', async () => {
    const url = await createUrl(new OpposerServer().configureTransports(['json']));
    const response = await fetch(url, { headers: { Accept: 'application/x-ndjson' } });
    expect(response.headers.get('content-type')).toContain('application/json');
  });
});
