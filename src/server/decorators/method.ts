import "reflect-metadata";

const METHOD_KEY = Symbol("method");

export default function Method() {
  return function (target: Object, name: string, context: any) {
    const methods = Reflect.getMetadata(METHOD_KEY, target.constructor) || [];

    methods.push({ name });

    Reflect.defineMetadata(METHOD_KEY, methods, target.constructor);
  };
}

export function getMethodMetadata(target: Object) {
  return Reflect.getMetadata(METHOD_KEY, target) || [];
}
