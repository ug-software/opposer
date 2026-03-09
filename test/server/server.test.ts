import { describe, test, expect } from 'vitest';
import opposerServer from '../../src/server/core/index.js';

describe('Server Module', () => {
  test('should allow registering middlewares', () => {
    const middleware = (req: any, res: any, next: any) => next();
    opposerServer.use(middleware);
    // @ts-ignore - accessing private for test
    expect(opposerServer.middlewares).toContain(middleware);
  });

  test('should have a listen method', () => {
    expect(typeof opposerServer.listen).toBe('function');
  });
});
