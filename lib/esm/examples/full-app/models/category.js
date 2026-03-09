var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, PrimaryColumn, f } from "../../../orm/index.js";
let Category = class Category {
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    Field(() => f().string("Title is string").required("Title is required")),
    __metadata("design:type", String)
], Category.prototype, "title", void 0);
Category = __decorate([
    Entity("categories")
], Category);
export default Category;
