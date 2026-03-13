var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, PrimaryColumn, CreateDateColumn, f } from "../../../orm/index.js";
let Session = class Session {
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    Field(() => f().string("usr is string.").required("usr is required.")),
    __metadata("design:type", String)
], Session.prototype, "usr", void 0);
__decorate([
    Field(() => f().string("ip is string.").required("ip is required.")),
    __metadata("design:type", String)
], Session.prototype, "ip", void 0);
__decorate([
    Field(() => f().string("ag is string.").required("ag is required.")),
    __metadata("design:type", String)
], Session.prototype, "ag", void 0);
__decorate([
    Field(() => f().string("rt is string.").required("rt is required.")),
    __metadata("design:type", String)
], Session.prototype, "rt", void 0);
__decorate([
    Field(() => f().boolean("ac is boolean.").required("ac is required.")),
    __metadata("design:type", Boolean)
], Session.prototype, "ac", void 0);
__decorate([
    Field(() => f().date("loi is date.").required("loi is required.")),
    __metadata("design:type", Date)
], Session.prototype, "loi", void 0);
__decorate([
    Field({ nullable: true, validation: () => f().date("lou is date.") }),
    __metadata("design:type", Date)
], Session.prototype, "lou", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Session.prototype, "ct", void 0);
Session = __decorate([
    Entity("se")
], Session);
export default Session;
