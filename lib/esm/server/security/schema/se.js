var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
let Session = class Session {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar" }),
    __metadata("design:type", String)
], Session.prototype, "usr", void 0);
__decorate([
    Column({ type: "date", default: new Date() }),
    __metadata("design:type", Date)
], Session.prototype, "loi", void 0);
__decorate([
    Column({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Session.prototype, "lou", void 0);
__decorate([
    Column({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Session.prototype, "ac", void 0);
__decorate([
    Column({ type: "varchar" }),
    __metadata("design:type", String)
], Session.prototype, "ip", void 0);
__decorate([
    Column({ type: "varchar" }),
    __metadata("design:type", String)
], Session.prototype, "ag", void 0);
__decorate([
    Column({ type: "varchar" }),
    __metadata("design:type", String)
], Session.prototype, "rt", void 0);
Session = __decorate([
    Entity("se")
], Session);
export default Session;
/*
  usr => user id;
  loi => data de login;
  lou: => data de logout;
  ip => ip de login;
  ag => agente do browser;
  rt => refresh token;
*/
