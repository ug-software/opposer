var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Handler, Method } from "../../server/decorators/index.js";
import { Success } from "../../server/helpers/index.js";
import scheduler from "../index.js";
import ScheduleHistory from "../models/history.js";
import opposerServer from "../../server/core/index.js";
let SchedulerHandler = class SchedulerHandler {
    get db() {
        return opposerServer.getContext("db");
    }
    async listTasks() {
        return Success(scheduler.getTasks());
    }
    async getHistory() {
        const historyRepo = this.db.getRepository(ScheduleHistory);
        const history = await historyRepo.find({
            pagination: { page: 0, take: 50 }, // Last 50 runs
        });
        const sortedHistory = history.sort((a, b) => new Date(b.st).getTime() - new Date(a.st).getTime());
        return Success(sortedHistory);
    }
    async runTask(payload) {
        const { name, data } = payload.data;
        const result = await scheduler.runTask(name, data);
        return Success(result);
    }
};
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerHandler.prototype, "listTasks", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerHandler.prototype, "getHistory", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerHandler.prototype, "runTask", null);
SchedulerHandler = __decorate([
    Handler("scheduler")
], SchedulerHandler);
export default SchedulerHandler;
