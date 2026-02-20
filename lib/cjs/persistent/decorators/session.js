"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Session;
const index_js_1 = __importDefault(require("../context/index.js"));
function Session() {
    return function (target, property) {
        const __property = Symbol(property);
        const __class = target.constructor.name;
        const __key = __class + ":" + property;
        Object.defineProperty(target, property, {
            get() {
                var __context = index_js_1.default.getStore();
                return __context.store.get(__key);
            },
            set(value) {
                var __context = index_js_1.default.getStore();
                __context.store.set(__key, value);
                this[__property] = value;
            },
            enumerable: true,
            configurable: true,
        });
    };
}
