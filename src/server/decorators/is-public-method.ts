import "reflect-metadata";

const PUBLIC_METHOD_KEY = Symbol("method");

export default function IsPublicMethod() {
  return function (target: Object, name: string, context: any) {
    const methods =
      Reflect.getMetadata(PUBLIC_METHOD_KEY, target.constructor) || [];

    methods.push({ name });

    Reflect.defineMetadata(PUBLIC_METHOD_KEY, methods, target.constructor);
  };
}

export function getIsPublicMethodMetadata(target: Object) {
  return Reflect.getMetadata(PUBLIC_METHOD_KEY, target) || [];
}
