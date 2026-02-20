import { ValidationFunction, SettingsField } from "../../interfaces/field";
import { SchemaDefinition } from "../../interfaces/schema";
export declare class ToolField {
    type: "string" | "boolean" | "date" | "number" | "relation" | "jsonb" | null;
    _cases: ValidationFunction[];
    _settings: SettingsField;
    default(value: any): this;
    when(test: (value: unknown, context: object) => string | null): this;
    validate(value: unknown, context: object): string[];
}
declare class NumberField extends ToolField {
    constructor(message: string);
    required(message: string): this;
    min(min: number, message: string): this;
    max(max: number, message: string): this;
}
declare class StringField extends ToolField {
    constructor(message: string);
    required(message: string): this;
    match(regex: RegExp, message: string): this;
}
declare class BooleanField extends ToolField {
    constructor(message: string);
    required(message: string): this;
}
declare class DateField extends ToolField {
    constructor(message: string);
    required(message: string): this;
}
declare class JsonField extends ToolField {
    private _children;
    constructor(children: SchemaDefinition);
    validate(value: any, context: object): string[];
}
export declare class Field {
    string(message: string): StringField;
    date(message: string): DateField;
    number(message: string): NumberField;
    boolean(message: string): BooleanField;
    json(fields: SchemaDefinition): JsonField;
    static validate(schema: any, values: Record<string, any>): Record<string, string[]>;
}
export default function (): Field;
export {};
