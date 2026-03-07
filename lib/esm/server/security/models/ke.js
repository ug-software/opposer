var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, PrimaryColumn, CreateDateColumn, f } from "../../../orm/index.js";
let Key = class Key {
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], Key.prototype, "id", void 0);
__decorate([
    Field(() => f().string("nm is string.").required("nm is required.")),
    __metadata("design:type", String)
], Key.prototype, "nm", void 0);
__decorate([
    Field(() => f().string("hs is string.").required("hs is required.")),
    __metadata("design:type", String)
], Key.prototype, "hs", void 0);
__decorate([
    Field(() => f().date("ex is date.").required("ex is required.")),
    __metadata("design:type", Date)
], Key.prototype, "ex", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Key.prototype, "ct", void 0);
Key = __decorate([
    Entity("ke")
], Key);
export default Key;
