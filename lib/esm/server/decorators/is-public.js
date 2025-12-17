import "reflect-metadata";
const PUBLIC_KEY = Symbol("is-public");
export default function Method() {
    return function (target, name, context) {
        let _public = Reflect.getMetadata(PUBLIC_KEY, target.constructor) || false;
        _public = true;
        Reflect.defineMetadata(PUBLIC_KEY, _public, target.constructor);
    };
}
export function getIsPublicMetadata(target) {
    return Reflect.getMetadata(PUBLIC_KEY, target) || [];
}
