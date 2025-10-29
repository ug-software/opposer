"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Global;
const global_js_1 = __importDefault(require("../cache/global.js"));
function Global() {
    return function (target, property) {
        const __property = Symbol(property);
        const __class = target.constructor.name;
        const __key = __class + ":" + property;
        Object.defineProperty(target, property, {
            get() {
                return global_js_1.default.get(__key);
            },
            set(value) {
                global_js_1.default.set(__key, value);
                this[__property] = value;
            },
            enumerable: true,
            configurable: true,
        });
    };
}
