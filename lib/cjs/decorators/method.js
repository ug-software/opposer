"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Method;
exports.getMethodMetadata = getMethodMetadata;
require("reflect-metadata");
const METHOD_KEY = Symbol("method");
function Method() {
    return function (target, name, descriptor) {
        const methods = Reflect.getMetadata(METHOD_KEY, target.constructor) || [];
        methods.push({ name });
        Reflect.defineMetadata(METHOD_KEY, methods, target.constructor);
    };
}
function getMethodMetadata(target) {
    return Reflect.getMetadata(METHOD_KEY, target) || [];
}
