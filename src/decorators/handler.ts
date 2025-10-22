import "reflect-metadata";

const HANDLER_KEY = Symbol("handler");

export default function Handler(name: string) {
  return function (constructor: Object) {
    Reflect.defineMetadata(HANDLER_KEY, { name }, constructor);
  };
}

export function getHandlerMetadata(target: Object) {
  return Reflect.getMetadata(HANDLER_KEY, target) || [];
}
