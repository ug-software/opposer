import "reflect-metadata";

const CONTROLLER_KEY = Symbol("controller");

export default function Controller(name: string) {
  return function (constructor: Object) {
    Reflect.defineMetadata(CONTROLLER_KEY, { name }, constructor);
  };
}

export function getControllerMetadata(target: Object) {
  return Reflect.getMetadata(CONTROLLER_KEY, target) || [];
}
