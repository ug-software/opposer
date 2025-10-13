import { EntitySchema } from "typeorm";
import { Type } from "../constants/index.js";

export interface SchemaDefinition {
  [key: string]: {
    type: Type;
    default?: any;
    required: boolean;
    match?: RegExp;
    length?: number;
    min?: number;
    max?: number;
  };
}

export interface SchemaResult {
  validation: Record<string, any>;
  entity: EntitySchema<unknown>;
  definition: SchemaDefinition;
}
