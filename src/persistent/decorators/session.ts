import context from "../context/index.js";
import type { ContextSession } from "../interfaces/context.js";

export default function Session() {
  return function (target: any, property: string) {
    const __property = Symbol(property);
    const __class = target.constructor.name;
    const __key = __class + ":" + property;

    Object.defineProperty(target, property, {
      get() {
        var __context = context.getStore() as ContextSession
        return __context.store.get(__key);
      },
      set(value) {
        var __context = context.getStore() as ContextSession
        __context.store.set(__key, value);
        this[__property] = value;
      },
      enumerable: true,
      configurable: true,
    });
  };
}