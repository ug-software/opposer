export interface SchemaDefinition {
    [key: string]: {
        type: "string" | "number" | "jsonb" | "boolean" | "array" | "date",
        default?: any,
        required: boolean,
        match?: RegExp,
        length?: number,
        min?: number,
        max?: number
    }
}