"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Action;
exports.getActionsMetadata = getActionsMetadata;
require("reflect-metadata");
const ACTIONS_KEY = Symbol("actions");
function Action() {
    return function (target, name, descriptor) {
        const actions = Reflect.getMetadata(ACTIONS_KEY, target.constructor) || [];
        actions.push({ name });
        Reflect.defineMetadata(ACTIONS_KEY, actions, target.constructor);
    };
}
function getActionsMetadata(target) {
    return Reflect.getMetadata(ACTIONS_KEY, target) || [];
}
