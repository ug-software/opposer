"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("../server/index.js"));
(async () => {
    var app = await (0, index_js_1.default)({
        cors: {
            origin: "*",
        },
    });
    app.initialize();
})();
