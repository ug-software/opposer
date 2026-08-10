import { describe, expect, test } from 'vitest';
import * as opposer from '../../src/index.js';

describe('Package entrypoint', () => {
  test('loads without circular model initialization errors', () => {
    expect(typeof opposer.Server).toBe('function');
    expect(opposer.StreamTransport).toBeDefined();
  });
});
