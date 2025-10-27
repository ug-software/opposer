import "reflect-metadata";

const METHOD_KEY = Symbol("method");

export default function Method(): MethodDecorator {
  return function (target, name) {
    const methods = Reflect.getMetadata(METHOD_KEY, target.constructor) || [];

    methods.push({ name });

    Reflect.defineMetadata(METHOD_KEY, methods, target.constructor);
  };
}

export function getMethodMetadata(target: Object) {
  return Reflect.getMetadata(METHOD_KEY, target) || [];
}
