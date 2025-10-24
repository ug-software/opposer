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
let Key = class Key {
};
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().string("key is string.").required("key is required.")),
    __metadata("design:type", String)
], Key.prototype, "hs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Key.prototype, "ct", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "date",
        default: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()),
    }),
    (0, index_js_1.Field)(() => (0, field_js_1.default)().date("expires is date.")),
    __metadata("design:type", Date)
], Key.prototype, "ex", void 0);
Key = __decorate([
    (0, typeorm_1.Entity)("ke")
], Key);
exports.default = Key;
/*
  hs => key
  ct => created at
  ex => expires date
*/
