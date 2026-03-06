import { Field as OrmField, MetadataStore } from "../../orm/index.js";

const FIELD_KEY = Symbol("field");

export default function Field(schema: any) {
  return (target: Object, name: string, context?: any) => {
    // 1. Legacy server metadata (for existing code that uses getFieldsMetadata)
    const fields = Reflect.getMetadata(FIELD_KEY, target.constructor) || [];
    fields.push({ name, schema: typeof schema === 'function' ? schema() : schema });
    Reflect.defineMetadata(FIELD_KEY, fields, target.constructor);

    // 2. ORM metadata (calling the ORM decorator logic)
    const ormDecorator = OrmField(typeof schema === 'function' ? { validation: schema } : schema);
    return ormDecorator(target, name);
  };
}

export function getFieldsMetadata(target: Object) {
  // Try to get from the constructor if target is an instance
  const constructor = typeof target === 'function' ? target : target.constructor;
  
  // 1. Get from legacy metadata
  const legacyFields = Reflect.getMetadata(FIELD_KEY, constructor) || [];
  
  // 2. Get from ORM MetadataStore
  const ormFields = MetadataStore.getFields(constructor as Function).map(f => ({
    name: f.name,
    schema: { type: f.type }
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
