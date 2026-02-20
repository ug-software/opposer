"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Field;
exports.getFieldsMetadata = getFieldsMetadata;
const FIELD_KEY = Symbol("field");
function Field(schema) {
    return (target, name) => {
        const fields = Reflect.getMetadata(FIELD_KEY, target.constructor) || [];
        fields.push({ name, schema: schema() });
        Reflect.defineMetadata(FIELD_KEY, fields, target.constructor);
    };
}
function getFieldsMetadata(target) {
    return Reflect.getMetadata(FIELD_KEY, target) || [];
}
