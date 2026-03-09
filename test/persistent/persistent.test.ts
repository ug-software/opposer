import { describe, test, expect, vi } from 'vitest';
import Context from '../../src/persistent/context/index.js';

// Mock system to prevent GlobalStore initialization error
vi.mock('../../src/system/index.js', () => ({
  default: {
    settings: {
      cache: {
        global: {
          revalidate: { timer: 60, unit: 'm' },
          maxmemory: { size: 100, unit: 'mb' }
        },
        type: 'memory'
      }
    }
  }
}));

describe('Persistent Module', () => {
  test('should store and retrieve data from Context using run', async () => {
    await Context.run({ requestId: '123' }, () => {
      const store = Context.getStore() as any;
      expect(store?.requestId).toBe('123');
    });
  });

  test('should handle nested contexts properly', async () => {
    await Context.run({ outer: 'A' }, async () => {
      const outerStore = Context.getStore() as any;
      expect(outerStore?.outer).toBe('A');
      await Context.run({ ...Context.getStore() as any, inner: 'B' }, () => {
        const innerStore = Context.getStore() as any;
        expect(innerStore?.outer).toBe('A');
        expect(innerStore?.inner).toBe('B');
      });
      const finalStore = Context.getStore() as any;
      expect(finalStore?.inner).toBeUndefined();
    });
  });
});
