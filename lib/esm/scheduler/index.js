import system from "../system/index.js";
import { getScheduleMetadata } from "./decorators/index.js";
import ScheduleHistory from "./models/history.js";
import opposerServer from "../server/core/index.js";
import { randomUUID } from "crypto";
export * from "./decorators/index.js";
export class Scheduler {
    constructor() {
        this.tasks = new Map();
    }
    get db() {
        return opposerServer.getContext("db");
    }
    async initialize(customSchedules) {
        const schedules = await system.getAllSchedules(customSchedules);
        for (const TargetClass of schedules) {
            if (TargetClass && typeof TargetClass === "function") {
                const metadata = getScheduleMetadata(TargetClass);
                if (metadata.length > 0) {
                    const instance = new TargetClass();
                    for (const taskOptions of metadata) {
                        if (taskOptions.enabled) {
                            this.tasks.set(taskOptions.name, {
                                ...taskOptions,
                                target: TargetClass,
                                instance,
                            });
                            console.log(`[scheduler] Registered task: ${taskOptions.name} (${taskOptions.interval}ms)`);
                        }
                    }
                }
            }
        }
    }
    start() {
        for (const [name, task] of this.tasks.entries()) {
            task.timer = setInterval(() => {
                this.runTask(name).catch((err) => console.error(`[scheduler] Error in task ${name}:`, err));
            }, task.interval);
        }
        console.log("[scheduler] All tasks started.");
    }
    async runTask(name, data) {
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
        });
        try {
            const result = await task.instance[task.propertyKey](data);
            const endTime = new Date();
            const duration = endTime.getTime() - startTime.getTime();
            await historyRepo.update({ id: historyId }, {
                ft: endTime,
                sc: true,
                du: duration,
            });
            return result;
        }
        catch (error) {
            const endTime = new Date();
            const duration = endTime.getTime() - startTime.getTime();
            await historyRepo.update({ id: historyId }, {
                ft: endTime,
                sc: false,
                er: error.message || String(error),
                du: duration,
            });
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
