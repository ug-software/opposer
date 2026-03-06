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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../scheduler/decorators/index.js");
const index_js_2 = __importDefault(require("../../../server/core/index.js"));
const book_js_1 = __importDefault(require("../models/book.js"));
class InventorySchedules {
    async checkStock() {
        const db = index_js_2.default.getContext("db");
        const bookRepo = db.getRepository(book_js_1.default);
        const count = await bookRepo.count({});
        console.log(`[schedule] Inventory check: ${count} books in library.`);
        return {
            timestamp: new Date().toISOString(),
            booksChecked: count,
            status: "Inventory levels are stable"
        };
    }
    async importCatalog() {
        console.log(`[schedule] Importing new titles from external partners...`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            imported: 12,
            skipped: 2,
            errors: 0
        };
    }
}
exports.default = InventorySchedules;
__decorate([
    (0, index_js_1.Schedule)({
        name: "library-inventory-check",
        interval: 300000, // 5 minutes
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventorySchedules.prototype, "checkStock", null);
__decorate([
    (0, index_js_1.Schedule)({
        name: "import-external-catalog",
        interval: 3600000, // 1 hour
        enabled: false
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventorySchedules.prototype, "importCatalog", null);
