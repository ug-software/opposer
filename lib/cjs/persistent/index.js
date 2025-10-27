"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = exports.GlobalStorage = exports.SessionStorage = void 0;
var session_js_1 = require("./cache/session.js");
Object.defineProperty(exports, "SessionStorage", { enumerable: true, get: function () { return __importDefault(session_js_1).default; } });
var global_js_1 = require("./cache/global.js");
Object.defineProperty(exports, "GlobalStorage", { enumerable: true, get: function () { return __importDefault(global_js_1).default; } });
var store_js_1 = require("./cache/store.js");
Object.defineProperty(exports, "Store", { enumerable: true, get: function () { return __importDefault(store_js_1).default; } });
