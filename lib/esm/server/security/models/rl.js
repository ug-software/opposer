var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, PrimaryColumn, Relation, CreateDateColumn, UpdateDateColumn, f } from "../../../orm/index.js";
import User from "./usr.js";
let Role = class Role {
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    Field(() => f().string("model is string.").required("model is required.")),
    __metadata("design:type", String)
], Role.prototype, "sm", void 0);
__decorate([
    Field(() => f().string("model is string.").required("model is required.")),
    __metadata("design:type", String)
], Role.prototype, "mt", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Role.prototype, "ct", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Role.prototype, "ut", void 0);
__decorate([
    Relation({
        type: "many-to-one",
        target: () => User,
        inverseSide: "rl"
    }),
    __metadata("design:type", Object)
], Role.prototype, "usr", void 0);
Role = __decorate([
    Entity("rl")
], Role);
export default Role;
