"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Field;
const FIELD_KEY = Symbol("field");
function Field(schema) {
    return (target, name) => {
        Reflect.defineMetadata(FIELD_KEY, schema(), target, name);
    };
}
