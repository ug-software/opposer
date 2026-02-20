"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("../system/index.js"));
const msPerUnit = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
};
function getNextSessionExpireDate() {
    return (new Date().getTime() +
        index_js_1.default.settings.cache.session.expire *
            msPerUnit[index_js_1.default.settings.cache.session.unit]);
}
function getSeconds(time, unit) {
    return time * msPerUnit[unit];
}
exports.default = { getNextSessionExpireDate, getSeconds, msPerUnit };
