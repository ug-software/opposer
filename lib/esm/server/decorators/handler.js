import "reflect-metadata";
const HANDLER_KEY = Symbol("handler");
export default function Handler(name) {
    return function (constructor) {
        Reflect.defineMetadata(HANDLER_KEY, { name }, constructor);
    };
}
export function getHandlerMetadata(target) {
    return Reflect.getMetadata(HANDLER_KEY, target) || [];
}
