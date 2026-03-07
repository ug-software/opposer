import system from "../../system/index.js";
import * as decorator from "../decorators/index.js";
const handlers = {};
export function toKebabCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // adiciona hífen antes de maiúsculas
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // caso AAAa
        .toLowerCase();
}
export function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}
// function responsible per cache handlers in project;
export async function loadHandlers(customHandlers) {
    var __allHandlers = await system.getAllHandlers(customHandlers);
    if (Array.isArray(__allHandlers) && Object.keys(handlers).length === 0) {
        return __allHandlers.reduce((handlers, handler) => {
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
