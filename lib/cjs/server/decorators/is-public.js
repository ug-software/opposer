"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IsPublic;
exports.getIsPublicMetadata = getIsPublicMetadata;
require("reflect-metadata");
const PUBLIC_KEY = Symbol("is-public");
function IsPublic() {
    return (target) => {
        Reflect.defineMetadata(PUBLIC_KEY, true, target);
    };
}
function getIsPublicMetadata(target) {
    return Reflect.getMetadata(PUBLIC_KEY, target) === true;
}
