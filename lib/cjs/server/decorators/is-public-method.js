"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IsPublicMethod;
exports.getIsPublicMethodMetadata = getIsPublicMethodMetadata;
require("reflect-metadata");
const PUBLIC_METHOD_KEY = Symbol("method");
function IsPublicMethod() {
    return function (target, name, context) {
        const methods = Reflect.getMetadata(PUBLIC_METHOD_KEY, target.constructor) || [];
        methods.push({ name });
        Reflect.defineMetadata(PUBLIC_METHOD_KEY, methods, target.constructor);
    };
}
function getIsPublicMethodMetadata(target) {
    return Reflect.getMetadata(PUBLIC_METHOD_KEY, target) || [];
}
