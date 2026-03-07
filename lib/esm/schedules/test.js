var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Schedule } from "../scheduler/decorators/index.js";
export default class TestSchedule {
    async heartbeat() {
        console.log(`[schedule] Heartbeat at ${new Date().toISOString()}`);
        return { status: "alive" };
    }
    async dailyReport(data) {
        console.log(`[schedule] Generating daily report...`, data);
        // Simulate long task
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`[schedule] Report sent.`);
        return { pdf: "report.pdf", sent: true };
    }
}
__decorate([
    Schedule({
        name: "heartbeat",
        interval: 10000, // 10 seconds
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestSchedule.prototype, "heartbeat", null);
__decorate([
    Schedule({
        name: "daily-report",
        interval: 86400000, // 24 hours
        enabled: false
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestSchedule.prototype, "dailyReport", null);
