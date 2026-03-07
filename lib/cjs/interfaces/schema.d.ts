import { Field } from "./field.js";
export interface SchemaDefinition {
    [key: string]: Field;
}
export interface SchemaResult {
    validation: Record<string, any>;
    entity: any;
    definition: SchemaDefinition;
}
