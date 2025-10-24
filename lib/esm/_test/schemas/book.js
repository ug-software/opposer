var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import Author from "./author.js";
import Field from "../../decorators/field.js";
import { f } from "../../database/index.js";
let Book = class Book {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("").required("Campo de preenchimento obrigatorio")),
    __metadata("design:type", String)
], Book.prototype, "name", void 0);
__decorate([
    Column({ type: "date" }),
    Field(() => f().date("").required("Campo de preenchimento obrigatorio")),
    __metadata("design:type", Date)
], Book.prototype, "published", void 0);
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("")),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    ManyToOne(() => Author, (author) => author.books),
    __metadata("design:type", Author)
], Book.prototype, "author", void 0);
Book = __decorate([
    Entity("book")
], Book);
export default Book;
