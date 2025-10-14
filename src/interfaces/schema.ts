import { EntitySchema, ObjectType } from "typeorm";
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

    //relations
    relation?: {
      target: () => ObjectType<unknown>;
      type: "many-to-one" | "one-to-many" | "many-to-many" | "one-to-one";
      inverseSide: string;
      joinColumn?: boolean;
      joinTable?: boolean;
      cascade?: boolean;
    };
  };
}

export interface SchemaResult {
  validation: Record<string, any>;
  entity: EntitySchema<any> & ClassDecorator;
  definition: SchemaDefinition;
}
