"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.User = void 0;
var usr_js_1 = require("./models/usr.js");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(usr_js_1).default; } });
var rl_js_1 = require("./models/rl.js");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return __importDefault(rl_js_1).default; } });
