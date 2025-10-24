var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, ManyToOne } from "typeorm";
import Schema from "../../database/schema.js";
import f from "../../database/field.js";
import { Field } from "../../decorators/index.js";
import User from "./usr.js";
let Role = class Role extends Schema {
};
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("schema is string.").required("schema is required.")),
    __metadata("design:type", String)
], Role.prototype, "sm", void 0);
__decorate([
    Column({ type: "varchar" }),
    Field(() => f().string("method is string.").required("method is required.")),
    __metadata("design:type", String)
], Role.prototype, "mt", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.rl),
    __metadata("design:type", User)
], Role.prototype, "usr", void 0);
Role = __decorate([
    Entity("rl")
], Role);
export default Role;
/*
    sm => schema,
    mt => method,
    usr => user
*/
