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
const user_js_1 = __importDefault(require("./user.js"));
let Permission = class Permission {
};
__decorate([
    (0, index_js_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], Permission.prototype, "id", void 0);
__decorate([
    (0, index_js_1.Field)({ type: "string" }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    (0, index_js_1.Relation)({
        type: "many-to-one",
        target: () => user_js_1.default,
        inverseSide: "permissions"
    }),
    __metadata("design:type", user_js_1.default)
], Permission.prototype, "user", void 0);
Permission = __decorate([
    (0, index_js_1.Entity)("permissions")
], Permission);
exports.default = Permission;
