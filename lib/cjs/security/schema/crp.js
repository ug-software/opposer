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
const typeorm_1 = require("typeorm");
(0, typeorm_1.Entity)("crp");
class ChangeRequestPassword {
}
exports.default = ChangeRequestPassword;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], ChangeRequestPassword.prototype, "lg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], ChangeRequestPassword.prototype, "tk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], ChangeRequestPassword.prototype, "ag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], ChangeRequestPassword.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", default: new Date() }),
    __metadata("design:type", Date)
], ChangeRequestPassword.prototype, "ct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", default: new Date() }),
    __metadata("design:type", Date)
], ChangeRequestPassword.prototype, "et", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], ChangeRequestPassword.prototype, "ud", void 0);
/*
  lg => user login;
  tk => forget token;
  ag => agent;
  ip => ip agent;
  ct => create at;
  et => expire at;
  ud => used;
*/
