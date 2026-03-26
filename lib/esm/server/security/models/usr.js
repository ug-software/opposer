var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, PrimaryColumn, Relation, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, f, } from "../../../orm/index.js";
import bcrypt from "bcrypt";
import Role from "./rl.js";
let User = class User {
    async hashPassword() {
        if (this.ps) {
            const salt = await bcrypt.genSalt(10);
            this.ps = await bcrypt.hash(this.ps, salt);
        }
    }
    async comparePassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.ps);
    }
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Field(() => f().string("first name is string.").required("first name is required.")),
    __metadata("design:type", String)
], User.prototype, "fn", void 0);
__decorate([
    Field(() => f().string("last name is string.").required("last name is required.")),
    __metadata("design:type", String)
], User.prototype, "ln", void 0);
__decorate([
    Field(() => f().string("ln is string.").required("ln is required.")),
    __metadata("design:type", String)
], User.prototype, "lg", void 0);
__decorate([
    Field(() => f()
        .string("password is string.")
        .required("password is required.")
        .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,}$/, "password not security, for strong password is necessary upper words, numbers and special characters.")),
    __metadata("design:type", String)
], User.prototype, "ps", void 0);
__decorate([
    Field({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "ac", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "ct", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "ut", void 0);
__decorate([
    Relation({
        type: "one-to-many",
        target: () => Role,
        inverseSide: "usr",
    }),
    __metadata("design:type", Array)
], User.prototype, "rl", void 0);
__decorate([
    BeforeInsert(),
    BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    Entity("usr")
], User);
export default User;
