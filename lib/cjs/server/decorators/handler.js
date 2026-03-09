"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Controller;
exports.getControllerMetadata = getControllerMetadata;
require("reflect-metadata");
const CONTROLLER_KEY = Symbol("controller");
function Controller(name) {
    return function (constructor) {
        Reflect.defineMetadata(CONTROLLER_KEY, { name }, constructor);
    };
}
function getControllerMetadata(target) {
    return Reflect.getMetadata(CONTROLLER_KEY, target) || [];
}
