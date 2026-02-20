"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = toKebabCase;
exports.toCamelCase = toCamelCase;
exports.loadHandlers = loadHandlers;
const system = __importStar(require("../../system/index.js"));
const decorator = __importStar(require("../decorators/index.js"));
const handlers = {};
function toKebabCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // adiciona hífen antes de maiúsculas
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // caso AAAa
        .toLowerCase();
}
function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}
// function responsible per cache handlers in project;
async function loadHandlers() {
    var __handlers = await system.getAllHandlers();
    if (Array.isArray(__handlers) && Object.keys(handlers).length === 0) {
        return __handlers.reduce((handlers, handler) => {
            var handlerMetadata = decorator.getHandlerMetadata(handler);
            var methodsMetadata = decorator.getMethodMetadata(handler);
            handlers[handlerMetadata.name] = {
                metadata: handlerMetadata,
                methods: Array.isArray(methodsMetadata) ? methodsMetadata : [],
                handler: handler,
            };
            return handlers;
        }, handlers);
    }
    return handlers;
}
