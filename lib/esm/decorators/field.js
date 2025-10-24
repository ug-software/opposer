const FIELD_KEY = Symbol("field");
export default function Field(schema) {
    return (target, name) => {
        Reflect.defineMetadata(FIELD_KEY, schema(), target, name);
    };
}
