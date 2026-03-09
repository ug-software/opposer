import { describe, test, expect, vi } from 'vitest';

// Mock Context to avoid DB dependency in scheduler initialization
vi.mock('../../src/server/context/index.js', () => ({
  default: {
    get: vi.fn()
  }
}));

import scheduler, { Schedule } from '../../src/scheduler/index.js';

describe('Scheduler Module', () => {
  test('should register a task with metadata', async () => {
    class TestSchedule {
      @Schedule({ name: 'test-job', interval: 5000 })
      async execute() {
        return 'executed';
      }
    }

    await scheduler.initialize([TestSchedule]);
    const tasks = scheduler.getTasks();
    
    expect(tasks.length).toBe(1);
    expect(tasks[0].name).toBe('test-job');
  });

  test('should have start method', async () => {
    expect(scheduler.start).toBeDefined();
  });
});
