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
const book_js_1 = __importDefault(require("./book.js"));
const field_js_1 = __importDefault(require("../../decorators/field.js"));
const index_js_1 = require("../../database/index.js");
let Author = class Author {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Author.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, field_js_1.default)(() => (0, index_js_1.f)().string("").required("")),
    __metadata("design:type", String)
], Author.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, field_js_1.default)(() => (0, index_js_1.f)().string("").required("")),
    __metadata("design:type", String)
], Author.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, field_js_1.default)(() => (0, index_js_1.f)().number("").required("")),
    __metadata("design:type", Number)
], Author.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    (0, field_js_1.default)(() => (0, index_js_1.f)().json({
        number: (0, index_js_1.f)().number(""),
        street: (0, index_js_1.f)().string(""),
    })),
    __metadata("design:type", Object)
], Author.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => book_js_1.default, (book) => book.author),
    __metadata("design:type", Array)
], Author.prototype, "books", void 0);
Author = __decorate([
    (0, typeorm_1.Entity)("author")
], Author);
exports.default = Author;
