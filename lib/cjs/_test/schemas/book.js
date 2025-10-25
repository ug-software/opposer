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
const author_js_1 = __importDefault(require("./author.js"));
const field_js_1 = __importDefault(require("../../decorators/field.js"));
const index_js_1 = require("../../database/index.js");
let Book = class Book {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, field_js_1.default)(() => (0, index_js_1.f)().string("").required("Campo de preenchimento obrigatorio")),
    __metadata("design:type", String)
], Book.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    (0, field_js_1.default)(() => (0, index_js_1.f)().date("").required("Campo de preenchimento obrigatorio")),
    __metadata("design:type", Date)
], Book.prototype, "published", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    (0, field_js_1.default)(() => (0, index_js_1.f)().string("")),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => author_js_1.default, (author) => author.books),
    __metadata("design:type", author_js_1.default)
], Book.prototype, "author", void 0);
Book = __decorate([
    (0, typeorm_1.Entity)("book")
], Book);
exports.default = Book;
