var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Schedule } from "../../../scheduler/index.js";
export default class LibraryAlertSchedules {
    async checkOverdue() {
        console.log(`[schedule] Checking for overdue book loans...`);
        // Simulating finding overdue loans
        const found = 3;
        if (found > 0) {
            console.log(`[schedule] Sending ${found} notifications to readers.`);
        }
        return {
            overdueCount: found,
            notificationsSent: true
        };
    }
    async generateSalesReport() {
        console.log(`[schedule] Generating periodic sales report for authors...`);
        // Simulation
        const reportId = `REP-${Math.floor(Math.random() * 10000)}`;
        return {
            reportId,
            status: "Report generated and available for download.",
            path: `/reports/${reportId}.pdf`
        };
    }
}
__decorate([
    Schedule({
        name: "overdue-book-loans",
        interval: 600000, // 10 minutes
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LibraryAlertSchedules.prototype, "checkOverdue", null);
__decorate([
    Schedule({
        name: "author-sales-report",
        interval: 1800000, // 30 minutes
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LibraryAlertSchedules.prototype, "generateSalesReport", null);
