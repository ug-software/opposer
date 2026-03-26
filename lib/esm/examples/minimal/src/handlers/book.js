var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { f, Field, Controller, Method, Payload, } from "../../../../server/index.js";
class GetAllPerDateDto {
}
__decorate([
    Field(() => f().date("typeof is Date").required("date is required")),
    __metadata("design:type", Date)
], GetAllPerDateDto.prototype, "date", void 0);
class GetAllBooksPerAuthorDto {
}
__decorate([
    Field(() => f().string("typeof is string").required("author is required")),
    __metadata("design:type", String)
], GetAllBooksPerAuthorDto.prototype, "author", void 0);
let Books = class Books {
    getAllBooksPerDate(filter) {
        return [];
    }
    getAllBooksPerAuthor(filter) { }
};
__decorate([
    Method(),
    __param(0, Payload(GetAllPerDateDto)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllPerDateDto]),
    __metadata("design:returntype", void 0)
], Books.prototype, "getAllBooksPerDate", null);
__decorate([
    Method(),
    __param(0, Payload(GetAllBooksPerAuthorDto)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllBooksPerAuthorDto]),
    __metadata("design:returntype", void 0)
], Books.prototype, "getAllBooksPerAuthor", null);
Books = __decorate([
    Controller("books")
], Books);
export default Books;
