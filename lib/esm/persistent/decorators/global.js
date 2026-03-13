import global from "../cache/global.js";
export default function Global() {
    return function (target, property) {
        const __property = Symbol(property);
        const __class = target.constructor.name;
        const __key = __class + ":" + property;
        Object.defineProperty(target, property, {
            get() {
                return global.get(__key);
            },
            set(value) {
                global.set(__key, value);
                this[__property] = value;
            },
            enumerable: true,
            configurable: true,
        });
    };
}
