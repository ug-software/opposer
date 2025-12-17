import "reflect-metadata";

const PUBLIC_KEY = Symbol("is-public");

export default function Method() {
  return function (target: Object, name: string, context: any) {
    let _public = Reflect.getMetadata(PUBLIC_KEY, target.constructor) || false;

    _public = true;

    Reflect.defineMetadata(PUBLIC_KEY, _public, target.constructor);
  };
}

export function getIsPublicMetadata(target: Object) {
  return Reflect.getMetadata(PUBLIC_KEY, target) || [];
}
