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
let ChangeRequestPassword = class ChangeRequestPassword {
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], ChangeRequestPassword.prototype, "id", void 0);
__decorate([
    Field(() => f().string("usr is string.").required("usr is required.")),
    __metadata("design:type", String)
], ChangeRequestPassword.prototype, "usr", void 0);
__decorate([
    Field(() => f().string("tk is string.").required("tk is required.")),
    __metadata("design:type", String)
], ChangeRequestPassword.prototype, "tk", void 0);
__decorate([
    Field(() => f().date("ex is date.").required("ex is required.")),
    __metadata("design:type", Date)
], ChangeRequestPassword.prototype, "ex", void 0);
__decorate([
    Field(() => f().boolean("ac is boolean.").required("ac is required.")),
    __metadata("design:type", Boolean)
], ChangeRequestPassword.prototype, "ac", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], ChangeRequestPassword.prototype, "ct", void 0);
ChangeRequestPassword = __decorate([
    Entity("crp")
], ChangeRequestPassword);
export default ChangeRequestPassword;
