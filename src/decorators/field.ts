const FIELD_KEY = Symbol("field");

export default function Field(schema: any) {
  return (target: Object, name: string) => {
    const fields = Reflect.getMetadata(FIELD_KEY, target.constructor) || [];
    fields.push({ name, schema: schema() });

    Reflect.defineMetadata(FIELD_KEY, fields, target.constructor);
  };
}

export function getFieldsMetadata(target: Object) {
  return Reflect.getMetadata(FIELD_KEY, target) || [];
}
