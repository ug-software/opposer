"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Handler;
exports.getHandlerMetadata = getHandlerMetadata;
require("reflect-metadata");
const HANDLER_KEY = Symbol("handler");
function Handler(name) {
    return function (constructor) {
        Reflect.defineMetadata(HANDLER_KEY, { name }, constructor);
    };
}
function getHandlerMetadata(target) {
    return Reflect.getMetadata(HANDLER_KEY, target) || [];
}
