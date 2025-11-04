import { ObjectType } from "typeorm";
export type ValidationFunction = (value: unknown, context: object) => string | null;
export interface SettingsField {
    required?: boolean;
    default?: any;
    length?: number;
    match?: RegExp;
    min?: number;
    max?: number;
    relation?: {
        target: () => ObjectType<unknown>;
        type: "many-to-one" | "one-to-many" | "many-to-many" | "one-to-one" | null;
        inverseSide: string;
        joinColumn?: boolean;
        joinTable?: boolean;
        cascade?: boolean;
    };
}
export interface Field {
    type: "string" | "boolean" | "number" | "date" | "relation" | "array" | "jsonb" | null;
    _cases: ValidationFunction[];
    _settings: SettingsField;
    validate: (value: any, context: object) => string[];
}
