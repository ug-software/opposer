import { Field as OrmField, MetadataStore } from "../../orm/index.js";
const FIELD_KEY = Symbol("field");
export default function Field(model) {
    return (target, name, context) => {
        // 1. Legacy server metadata (for existing code that uses getFieldsMetadata)
        const fields = Reflect.getMetadata(FIELD_KEY, target.constructor) || [];
        fields.push({ name, model: typeof model === 'function' ? model() : model });
        Reflect.defineMetadata(FIELD_KEY, fields, target.constructor);
        // 2. ORM metadata (calling the ORM decorator logic)
        const ormDecorator = OrmField(typeof model === 'function' ? { validation: model } : model);
        return ormDecorator(target, name);
    };
}
export function getFieldsMetadata(target) {
    // Try to get from the constructor if target is an instance
    const constructor = typeof target === 'function' ? target : target.constructor;
    // 1. Get from legacy metadata
    const legacyFields = Reflect.getMetadata(FIELD_KEY, constructor) || [];
    // 2. Get from ORM MetadataStore
    const ormFields = MetadataStore.getFields(constructor).map(f => ({
        name: f.name,
        model: { type: f.type }
    }));
    // Combine and remove duplicates (by name)
    const allFields = [...legacyFields];
    ormFields.forEach(of => {
        if (!allFields.find(lf => lf.name === of.name)) {
            allFields.push(of);
        }
    });
    return allFields;
}
