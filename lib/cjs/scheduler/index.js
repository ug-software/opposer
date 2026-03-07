"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const index_js_1 = __importDefault(require("../system/index.js"));
const index_js_2 = require("./decorators/index.js");
const history_js_1 = __importDefault(require("./models/history.js"));
const index_js_3 = __importDefault(require("../server/core/index.js"));
const crypto_1 = require("crypto");
__exportStar(require("./decorators/index.js"), exports);
class Scheduler {
    constructor() {
        this.tasks = new Map();
    }
    get db() {
        return index_js_3.default.getContext("db");
    }
    async initialize(customSchedules) {
        const schedules = await index_js_1.default.getAllSchedules(customSchedules);
        for (const TargetClass of schedules) {
            if (TargetClass && typeof TargetClass === "function") {
                const metadata = (0, index_js_2.getScheduleMetadata)(TargetClass);
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
        const historyRepo = this.db.getRepository(history_js_1.default);
        const startTime = new Date();
        const historyId = (0, crypto_1.randomUUID)();
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
exports.Scheduler = Scheduler;
exports.default = new Scheduler();
