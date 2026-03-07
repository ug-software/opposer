import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import system from "../system/index.js";
import { getScheduleMetadata } from "./decorators/index.js";
import ScheduleHistory from "./models/history.js";
import { OpposerDatabase } from "../orm/index.js";
import { randomUUID } from "crypto";
import { ClassType } from "../interfaces/system.js";
import Context from "../server/context/index.js";

export * from "./decorators/index.js";

export interface RegisteredTask {
  name: string;
  interval: number;
  propertyKey: string;
  target: any;
  instance: any;
  timer?: NodeJS.Timeout;
}

export class Scheduler {
  private tasks: Map<string, RegisteredTask> = new Map();

  private get db() {
    return Context.get<OpposerDatabase>("db");
  }

  async initialize(customSchedules?: string | ClassType<unknown>[]) {
    const schedules = await system.getAllSchedules(customSchedules);

    for (const TargetClass of schedules) {
      if (TargetClass && typeof TargetClass === "function") {
        const metadata = getScheduleMetadata(TargetClass);
        if (metadata.length > 0) {
          const instance = new (TargetClass as any)();
          for (const taskOptions of metadata) {
            if (taskOptions.enabled) {
              this.tasks.set(taskOptions.name, {
                ...taskOptions,
                target: TargetClass,
                instance,
              });
              console.log(
                `[scheduler] Registered task: ${taskOptions.name} (${taskOptions.interval}ms)`
              );
            }
          }
        }
      }
    }
  }

  start() {
    for (const [name, task] of this.tasks.entries()) {
      task.timer = setInterval(() => {
        this.runTask(name).catch((err) =>
          console.error(`[scheduler] Error in task ${name}:`, err)
        );
      }, task.interval);
    }
    console.log("[scheduler] All tasks started.");
  }

  async runTask(name: string, data?: any): Promise<any> {
    const task = this.tasks.get(name);
    if (!task) {
      throw new Error(`Task ${name} not found.`);
    }

    const historyRepo = this.db.getRepository(ScheduleHistory);
    const startTime = new Date();
    const historyId = randomUUID();

    // Create initial history record
    await historyRepo.insert({
      id: historyId,
      nm: name,
      st: startTime,
      sc: false,
    } as any);

    try {
      const result = await task.instance[task.propertyKey](data);
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      await historyRepo.update({ id: historyId }, {
        ft: endTime,
        sc: true,
        du: duration,
      } as any);

      return result;
    } catch (error: any) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      await historyRepo.update({ id: historyId }, {
        ft: endTime,
        sc: false,
        er: error.message || String(error),
        du: duration,
      } as any);

      throw error;
    }
  }

  getTasks() {
    return Array.from(this.tasks.values()).map((t) => ({
      name: t.name,
      interval: t.interval,
      enabled: true,
    }));
  }
}

export default new Scheduler();
