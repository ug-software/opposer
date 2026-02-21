"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.User = void 0;
var usr_1 = require("./schema/usr");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(usr_1).default; } });
var rl_1 = require("./schema/rl");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return __importDefault(rl_1).default; } });
