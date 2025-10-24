var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field } from "../../decorators/index.js";
import f from "../../database/field.js";
import Role from "./rl.js";
let User = class User {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("").required("")),
    __metadata("design:type", String)
], User.prototype, "fn", void 0);
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("").required("")),
    __metadata("design:type", String)
], User.prototype, "lm", void 0);
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("").required("").match(RegExp(""), "")),
    __metadata("design:type", String)
], User.prototype, "em", void 0);
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("").required("")),
    __metadata("design:type", String)
], User.prototype, "ps", void 0);
__decorate([
    Column({ type: "boolean", default: true }),
    Field(() => f().boolean("")),
    __metadata("design:type", Boolean)
], User.prototype, "ac", void 0);
__decorate([
    Column({ type: "date", default: new Date() }),
    Field(() => f().date("")),
    __metadata("design:type", String)
], User.prototype, "ct", void 0);
__decorate([
    Column({ type: "date", default: new Date() }),
    Field(() => f().date("")),
    __metadata("design:type", Date)
], User.prototype, "ut", void 0);
__decorate([
    OneToMany(() => Role, (role) => role.usr),
    __metadata("design:type", Array)
], User.prototype, "rl", void 0);
User = __decorate([
    Entity("urs")
], User);
export default User;
/*
    fn => firstName,
    lm => lastName,
    em => e-mail,
    ps => password,
    ac => active,
    ct => created at,
    ut => update at
*/
