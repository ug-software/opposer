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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = toKebabCase;
exports.toCamelCase = toCamelCase;
exports.loadControllers = loadControllers;
const index_js_1 = __importDefault(require("../../system/index.js"));
const decorator = __importStar(require("../decorators/index.js"));
const controllers = {};
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
// function responsible per cache controllers in project;
async function loadControllers(customControllers) {
    var __allControllers = await index_js_1.default.getAllControllers(customControllers);
    if (Array.isArray(__allControllers) && Object.keys(controllers).length === 0) {
        return __allControllers.reduce((controllers, controller) => {
            var controllerMetadata = decorator.getControllerMetadata(controller);
            var methodsMetadata = decorator.getMethodMetadata(controller);
            controllers[controllerMetadata.name] = {
                metadata: controllerMetadata,
                methods: Array.isArray(methodsMetadata) ? methodsMetadata : [],
                controller: controller,
            };
            return controllers;
        }, controllers);
    }
    return controllers;
}
