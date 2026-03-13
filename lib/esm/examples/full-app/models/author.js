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
import Book from "./book.js";
let Author = class Author {
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], Author.prototype, "id", void 0);
__decorate([
    Field(() => f().string("Name is string").required("Name is required")),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    Field({ type: "string" }),
    __metadata("design:type", String)
], Author.prototype, "nationality", void 0);
__decorate([
    Relation({
        type: "one-to-many",
        target: () => Book,
        inverseSide: "author"
    }),
    __metadata("design:type", Array)
], Author.prototype, "books", void 0);
Author = __decorate([
    Entity("authors", { description: "The author of the book, which contains the name and nationality" })
], Author);
export default Author;
