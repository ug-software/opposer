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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const index_js_1 = require("../../decorators/index.js");
const field_js_1 = __importDefault(require("../../database/field.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const rl_js_1 = __importDefault(require("./rl.js"));
let User = class User {
    async hashPassword() {
        if (this.ps) {
            const salt = await bcrypt_1.default.genSalt(10);
            this.ps = await bcrypt_1.default.hash(this.ps, salt);
        }
    }
    async comparePassword(plainPassword) {
        return bcrypt_1.default.compare(plainPassword, this.ps);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("first name is string.").required("first name is required.")),
    __metadata("design:type", String)
], User.prototype, "fn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("last name is string.").required("last name is required.")),
    __metadata("design:type", String)
], User.prototype, "ln", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("ln is string.").required("ln is required.")),
    __metadata("design:type", String)
], User.prototype, "lg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)()
        .string("password is string.")
        .required("password is required.")
        .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,}$/, "password not security, for strong password is necessary upper words, numbers and special characters.")),
    __metadata("design:type", String)
], User.prototype, "ps", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "ac", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "ct", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "ut", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rl_js_1.default, (role) => role.usr),
    __metadata("design:type", Array)
], User.prototype, "rl", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    (0, typeorm_1.Entity)("usr")
], User);
exports.default = User;
/*
    fn => firstName,
    lm => lastName,
    em => e-mail,
    ps => password,
    ac => active,
    ct => created at,
    ut => update at
*/
