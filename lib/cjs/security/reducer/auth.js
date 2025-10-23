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
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../decorators/index.js");
let Auth = class Auth {
    register() { }
    login() { }
    refresh() { }
    logout() { }
    me() { }
    changePassword() { }
    forgotPassword() { }
    resetPassword() { }
};
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "register", null);
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "login", null);
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "refresh", null);
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "logout", null);
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "me", null);
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "changePassword", null);
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "forgotPassword", null);
__decorate([
    (0, index_js_1.Action)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Auth.prototype, "resetPassword", null);
Auth = __decorate([
    (0, index_js_1.Handler)("auth")
], Auth);
exports.default = Auth;
/*
    {
        handler: auth,
        action: register,
        payload: {
            em: "",
            ps: ""
        }
    }
*/
