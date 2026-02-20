import context from "../context/index.js";
export default function Session() {
    return function (target, property) {
        const __property = Symbol(property);
        const __class = target.constructor.name;
        const __key = __class + ":" + property;
        Object.defineProperty(target, property, {
            get() {
                var __context = context.getStore();
                return __context.store.get(__key);
            },
            set(value) {
                var __context = context.getStore();
                __context.store.set(__key, value);
                this[__property] = value;
            },
            enumerable: true,
            configurable: true,
        });
    };
}
