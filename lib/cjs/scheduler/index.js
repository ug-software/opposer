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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const index_js_1 = __importDefault(require("../system/index.js"));
const index_js_2 = require("./decorators/index.js");
const history_js_1 = __importDefault(require("./models/history.js"));
const index_js_3 = __importDefault(require("../server/core/index.js"));
const crypto_1 = require("crypto");
class Scheduler {
    constructor() {
        this.tasks = new Map();
    }
    get db() {
        return index_js_3.default.getContext("db");
    }
    async initialize(customSchedulesPath) {
        const root = process.cwd();
        const settings = index_js_1.default.getSettingsFile();
        let schedulesPath = customSchedulesPath || path_1.default.resolve(root, "src", "schedules");
        if (!customSchedulesPath && settings.schedules) {
            schedulesPath = path_1.default.resolve(root, settings.schedules);
        }
        if (!fs_1.default.existsSync(schedulesPath)) {
            console.log(`[scheduler] Directory not found: ${schedulesPath}`);
            return;
        }
        const files = index_js_1.default.getAllFiles(schedulesPath);
        for (const file of files) {
            const fileUrl = (0, url_1.pathToFileURL)(file).href;
            const module = await Promise.resolve(`${fileUrl}`).then(s => __importStar(require(s)));
            const TargetClass = module.default;
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
