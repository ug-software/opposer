"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toBytes(value, unit) {
    const base = 1024;
    const units = {
        mb: base ** 2,
        gb: base ** 3,
    };
    return value * units[unit];
}
function roughSizeOfObject(object) {
    const seen = new WeakSet();
    function sizeOf(value) {
        if (value === null || value === undefined)
            return 0;
        switch (typeof value) {
            case "boolean":
                return 4;
            case "number":
                return 8;
            case "string":
                return value.length * 2; // cada caractere ~2 bytes (UTF-16)
            case "object":
                if (seen.has(value))
                    return 0;
                seen.add(value);
                let bytes = 0;
                if (Array.isArray(value)) {
                    value.forEach((el) => (bytes += sizeOf(el)));
                }
                else {
                    Object.keys(value).forEach((key) => {
                        bytes += sizeOf(key);
                        bytes += sizeOf(value[key]);
                    });
                }
                return bytes;
            default:
                return 0;
        }
    }
    return sizeOf(object);
}
exports.default = { toBytes, roughSizeOfObject };
