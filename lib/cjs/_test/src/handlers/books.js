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
const index_js_1 = require("../../../server/index.js");
const index_js_2 = require("../../../persistent/index.js");
let Books = class Books {
    getTopAcess() {
        return this.topAcess;
    }
    setNewAcess(payload) { }
    generateExtractForManagerTopAcess() { }
};
__decorate([
    (0, index_js_2.Global)(),
    __metadata("design:type", Array)
], Books.prototype, "topAcess", void 0);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Books.prototype, "getTopAcess", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Books.prototype, "setNewAcess", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Books.prototype, "generateExtractForManagerTopAcess", null);
Books = __decorate([
    (0, index_js_1.Handler)("book")
], Books);
exports.default = Books;
