var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { db } from "../../database/connect.js";
import Handler from "../../decorators/handler.js";
import Method from "../../decorators/method.js";
import book from "../schemas/book.js";
let Book = class Book {
    async getLastFiveBooksPublished() {
        var bookRepository = db.getRepository(book);
        return await bookRepository.find({
            order: { published: "DESC" },
            take: 5,
        });
    }
};
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Book.prototype, "getLastFiveBooksPublished", null);
Book = __decorate([
    Handler("book")
], Book);
export default Book;
