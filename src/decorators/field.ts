const FIELD_KEY = Symbol("field");

export default function Field(schema: any) {
  return (target: Object, name: string) => {
    Reflect.defineMetadata(FIELD_KEY, schema(), target, name);
  };
}
