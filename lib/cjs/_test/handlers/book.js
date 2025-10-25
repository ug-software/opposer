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
const connect_js_1 = require("../../database/connect.js");
const handler_js_1 = __importDefault(require("../../decorators/handler.js"));
const method_js_1 = __importDefault(require("../../decorators/method.js"));
const book_js_1 = __importDefault(require("../schemas/book.js"));
let Book = class Book {
    async getLastFiveBooksPublished() {
        var bookRepository = connect_js_1.db.getRepository(book_js_1.default);
        return await bookRepository.find({
            order: { published: "DESC" },
            take: 5,
        });
    }
};
__decorate([
    (0, method_js_1.default)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Book.prototype, "getLastFiveBooksPublished", null);
Book = __decorate([
    (0, handler_js_1.default)("book")
], Book);
exports.default = Book;
