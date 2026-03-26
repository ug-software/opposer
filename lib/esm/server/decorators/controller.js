import "reflect-metadata";
const CONTROLLER_KEY = Symbol("controller");
export default function Controller(name) {
    return function (constructor) {
        Reflect.defineMetadata(CONTROLLER_KEY, { name }, constructor);
    };
}
export function getControllerMetadata(target) {
    return Reflect.getMetadata(CONTROLLER_KEY, target) || [];
}
