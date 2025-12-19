import type { MemoryUnit } from "../interfaces/system.js";
declare function toBytes(value: number, unit: MemoryUnit): number;
declare function roughSizeOfObject(object: Object): number;
declare const _default: {
    toBytes: typeof toBytes;
    roughSizeOfObject: typeof roughSizeOfObject;
};
export default _default;
