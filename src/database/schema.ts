import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SchemaDefinition, SchemaResult } from "../interfaces/schema.js";
import yup from "yup";

export default function Schema(
  name: string,
  definition: SchemaDefinition
): SchemaResult {
  var validation: Record<string, any> = {};

  // Classe dinâmica TypeORM
  @Entity(name)
  class entity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  }

  for (const [key, field] of Object.entries(definition)) {
    let schema: any;

    switch (field.type) {
      case "string":
        schema = yup.string();
        if (field.length) {
          schema = schema.max(field.length);
        }

        if (field.min) {
          schema = schema.min(field.min);
        }

        if (field.match) {
          schema = schema.matches(field.match);
        }
        break;
      case "number":
        schema = yup.number();
        if (field.min !== undefined) {
          schema = schema.min(field.min);
        }

        if (field.max !== undefined) {
          schema = schema.max(field.max);
        }
        break;
      case "boolean":
        schema = yup.boolean();
        break;
      case "date":
        schema = yup.date();
        break;
      case "array":
        schema = yup.array();
        break;
      case "jsonb":
        schema = yup.object().test("is-object", "is not object", (value) => {
          return (
            typeof value === "object" && value !== null && !Array.isArray(value)
          );
        });
        break;
      default:
        throw new Error(`type not suported: ${field.type}`);
    }

    if (field.required) {
      schema = schema.required();
    } else {
      schema = schema.notRequired();
    }

    //repassa o schema de validaçao
    validation[key] = schema;

    const decorator = Column({
      type:
        field.type === "string"
          ? "varchar"
          : field.type === "number"
          ? "float"
          : field.type === "boolean"
          ? "boolean"
          : field.type === "jsonb"
          ? "jsonb"
          : "timestamp",
      length: field.length,
      default: field.default,
      nullable: !field.required,
    });

    // aplica o decorator manualmente
    decorator(entity.prototype, key);
  }

  return {
    validation,
    entity,
    definition,
  };
}
