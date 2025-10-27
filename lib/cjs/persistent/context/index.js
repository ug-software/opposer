"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_hooks_1 = require("async_hooks");
const context = new async_hooks_1.AsyncLocalStorage();
exports.default = context;
