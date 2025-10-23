import { EntitySchema } from "typeorm";
import { Field } from "./field.js";
export interface SchemaDefinition {
    [key: string]: Field;
}
export interface SchemaResult {
    validation: Record<string, any>;
    entity: EntitySchema<any> & ClassDecorator;
    definition: SchemaDefinition;
}
