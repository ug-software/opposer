import { Type } from "../constants";

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
