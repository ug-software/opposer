"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Method;
exports.getIsPublicMetadata = getIsPublicMetadata;
require("reflect-metadata");
const PUBLIC_KEY = Symbol("is-public");
function Method() {
    return function (target, name, context) {
        let _public = Reflect.getMetadata(PUBLIC_KEY, target.constructor) || false;
        _public = true;
        Reflect.defineMetadata(PUBLIC_KEY, _public, target.constructor);
    };
}
function getIsPublicMetadata(target) {
    return Reflect.getMetadata(PUBLIC_KEY, target) || [];
}
