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
const author_js_1 = __importDefault(require("./author.js"));
const category_js_1 = __importDefault(require("./category.js"));
let Book = class Book {
};
__decorate([
    (0, index_js_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    (0, index_js_1.Field)(() => (0, index_js_1.f)().string("Title is string").required("Title is required")),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, index_js_1.Field)({ type: "number", default: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "price", void 0);
__decorate([
    (0, index_js_1.Relation)({
        type: "many-to-one",
        target: () => author_js_1.default,
        inverseSide: "books"
    }),
    __metadata("design:type", author_js_1.default)
], Book.prototype, "author", void 0);
__decorate([
    (0, index_js_1.Relation)({
        type: "many-to-one",
        target: () => category_js_1.default,
        inverseSide: "books"
    }),
    __metadata("design:type", category_js_1.default)
], Book.prototype, "category", void 0);
Book = __decorate([
    (0, index_js_1.Entity)("books", { description: "Entity representing a book in the store" })
], Book);
exports.default = Book;
