import type { MemoryUnit } from "../interfaces/system.js";

function toBytes(value: number, unit: MemoryUnit): number {
  const base = 1024;
  const units: Record<MemoryUnit, number> = {
    mb: base ** 2,
    gb: base ** 3,
  };
  return value * units[unit];
}

function roughSizeOfObject(object: Object) {
  const seen = new WeakSet();

  function sizeOf(value: any) {
    if (value === null || value === undefined) return 0;

    switch (typeof value) {
      case "boolean":
        return 4;
      case "number":
        return 8;
      case "string":
        return value.length * 2; // cada caractere ~2 bytes (UTF-16)
      case "object":
        if (seen.has(value)) return 0;
        seen.add(value);

        let bytes = 0;

        if (Array.isArray(value)) {
          value.forEach((el) => (bytes += sizeOf(el)));
        } else {
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

export default { toBytes, roughSizeOfObject };
