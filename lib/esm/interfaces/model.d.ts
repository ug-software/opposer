import { Field } from "./field.js";
export interface ModelDefinition {
    [key: string]: Field;
}
export interface ModelResult {
    validation: Record<string, any>;
    entity: any;
    definition: ModelDefinition;
}
