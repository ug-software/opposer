var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, PrimaryColumn, Relation, f } from "../../../orm/index.js";
import Author from "./author.js";
import Category from "./category.js";
let Book = class Book {
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    Field(() => f().string("Title is string").required("Title is required")),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    Field({ type: "number", default: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "price", void 0);
__decorate([
    Relation({
        type: "many-to-one",
        target: () => Author,
        inverseSide: "books"
    }),
    __metadata("design:type", Author)
], Book.prototype, "author", void 0);
__decorate([
    Relation({
        type: "many-to-one",
        target: () => Category,
        inverseSide: "books"
    }),
    __metadata("design:type", Category)
], Book.prototype, "category", void 0);
Book = __decorate([
    Entity("books", { description: "Entity representing a book in the store" })
], Book);
export default Book;
