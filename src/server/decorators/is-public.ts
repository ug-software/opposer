import "reflect-metadata";

const PUBLIC_KEY = Symbol("is-public");

export default function IsPublic(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(PUBLIC_KEY, true, target);
  };
}

export function getIsPublicMetadata(target: Object): boolean {
  return Reflect.getMetadata(PUBLIC_KEY, target) === true;
}
