"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = exports.GlobalStorage = exports.SessionStorage = void 0;
var session_1 = require("./session");
Object.defineProperty(exports, "SessionStorage", { enumerable: true, get: function () { return __importDefault(session_1).default; } });
var global_1 = require("./global");
Object.defineProperty(exports, "GlobalStorage", { enumerable: true, get: function () { return __importDefault(global_1).default; } });
var store_1 = require("./store");
Object.defineProperty(exports, "Store", { enumerable: true, get: function () { return __importDefault(store_1).default; } });
