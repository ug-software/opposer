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
const index_js_1 = require("../../../orm/index.js");
const profile_js_1 = __importDefault(require("./profile.js"));
const permission_js_1 = __importDefault(require("./permission.js"));
let User = class User {
};
__decorate([
    (0, index_js_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, index_js_1.Field)({
        type: "string",
        validation: () => (0, index_js_1.f)().string("Name must be a string").required("Name is required")
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, index_js_1.Field)({
        type: "string",
        validation: () => (0, index_js_1.f)().string("Email must be a string").required("Email is required").match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, index_js_1.Field)({
        type: "number",
        default: 18,
        validation: () => (0, index_js_1.f)().number("Age must be a number").min(18, "Must be at least 18 years old")
    }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, index_js_1.Field)({ type: "date", default: new Date() }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, index_js_1.Relation)({
        type: "one-to-one",
        target: () => profile_js_1.default,
        inverseSide: "user",
        joinColumn: true
    }),
    __metadata("design:type", profile_js_1.default)
], User.prototype, "profile", void 0);
__decorate([
    (0, index_js_1.Relation)({
        type: "one-to-many",
        target: () => permission_js_1.default,
        inverseSide: "user"
    }),
    __metadata("design:type", Array)
], User.prototype, "permissions", void 0);
User = __decorate([
    (0, index_js_1.Entity)("users")
], User);
exports.default = User;
