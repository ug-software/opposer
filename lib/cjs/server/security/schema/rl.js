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
const field_js_1 = __importDefault(require("../../database/field.js"));
const index_js_1 = require("../../decorators/index.js");
const usr_js_1 = __importDefault(require("./usr.js"));
let Role = class Role {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("schema is string.").required("schema is required.")),
    __metadata("design:type", String)
], Role.prototype, "sm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("method is string.").required("method is required.")),
    __metadata("design:type", String)
], Role.prototype, "mt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usr_js_1.default, (user) => user.rl),
    __metadata("design:type", usr_js_1.default)
], Role.prototype, "usr", void 0);
Role = __decorate([
    (0, typeorm_1.Entity)("rl")
], Role);
exports.default = Role;
/*
    sm => schema,
    mt => method,
    usr => user
*/
