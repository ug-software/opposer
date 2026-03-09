"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../server/decorators/index.js");
const index_js_2 = require("../../server/helpers/index.js");
const index_js_3 = __importDefault(require("../index.js"));
const history_js_1 = __importDefault(require("../models/history.js"));
const index_js_4 = require("../../server/index.js");
let SchedulerHandler = class SchedulerHandler {
    get db() {
        return index_js_4.Context.get('db');
    }
    async listTasks() {
        return (0, index_js_2.Success)(index_js_3.default.getTasks());
    }
    async getHistory() {
        const historyRepo = this.db.getRepository(history_js_1.default);
        const history = await historyRepo.find({
            pagination: { page: 0, take: 50 }, // Last 50 runs
        });
        const sortedHistory = history.sort((a, b) => new Date(b.st).getTime() - new Date(a.st).getTime());
        return (0, index_js_2.Success)(sortedHistory);
    }
    async runTask(payload) {
        const { name, data } = payload.data;
        const result = await index_js_3.default.runTask(name, data);
        return (0, index_js_2.Success)(result);
    }
};
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerHandler.prototype, "listTasks", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerHandler.prototype, "getHistory", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerHandler.prototype, "runTask", null);
SchedulerHandler = __decorate([
    (0, index_js_1.Handler)('scheduler')
], SchedulerHandler);
exports.default = SchedulerHandler;
