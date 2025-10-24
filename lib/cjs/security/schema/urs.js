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
const rl_js_1 = __importDefault(require("./rl.js"));
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("").required("")),
    __metadata("design:type", String)
], User.prototype, "fn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("").required("")),
    __metadata("design:type", String)
], User.prototype, "lm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("").required("").match(RegExp(""), "")),
    __metadata("design:type", String)
], User.prototype, "em", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("").required("")),
    __metadata("design:type", String)
], User.prototype, "ps", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().boolean("")),
    __metadata("design:type", Boolean)
], User.prototype, "ac", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", default: new Date() }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().date("")),
    __metadata("design:type", String)
], User.prototype, "ct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", default: new Date() }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().date("")),
    __metadata("design:type", Date)
], User.prototype, "ut", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rl_js_1.default, (role) => role.usr),
    __metadata("design:type", Array)
], User.prototype, "rl", void 0);
User = __decorate([
    (0, typeorm_1.Entity)("urs")
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
