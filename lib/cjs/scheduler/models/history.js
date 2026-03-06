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
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../orm/index.js");
let ScheduleHistory = class ScheduleHistory {
};
__decorate([
    (0, index_js_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], ScheduleHistory.prototype, "id", void 0);
__decorate([
    (0, index_js_1.Field)(() => (0, index_js_1.f)().string("name is string.").required("name is required.")),
    __metadata("design:type", String)
], ScheduleHistory.prototype, "nm", void 0);
__decorate([
    (0, index_js_1.Field)(() => (0, index_js_1.f)().date("started at is date.").required("started at is required.")),
    __metadata("design:type", Date)
], ScheduleHistory.prototype, "st", void 0);
__decorate([
    (0, index_js_1.Field)(() => (0, index_js_1.f)().date("finished at is date.")),
    __metadata("design:type", Date)
], ScheduleHistory.prototype, "ft", void 0);
__decorate([
    (0, index_js_1.Field)(() => (0, index_js_1.f)().boolean("success is boolean.")),
    __metadata("design:type", Boolean)
], ScheduleHistory.prototype, "sc", void 0);
__decorate([
    (0, index_js_1.Field)(() => (0, index_js_1.f)().string("error is string.")),
    __metadata("design:type", String)
], ScheduleHistory.prototype, "er", void 0);
__decorate([
    (0, index_js_1.Field)(() => (0, index_js_1.f)().number("duration is number.")),
    __metadata("design:type", Number)
], ScheduleHistory.prototype, "du", void 0);
__decorate([
    (0, index_js_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ScheduleHistory.prototype, "ct", void 0);
ScheduleHistory = __decorate([
    (0, index_js_1.Entity)("sh")
], ScheduleHistory);
exports.default = ScheduleHistory;
