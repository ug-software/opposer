import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
} from "typeorm";
import { SchemaDefinition, SchemaResult } from "../interfaces/schema.js";
import { Type } from "../constants/index.js";

import Field from "./field.js";

export default function Schema(
  name: string,
  definition: (f: Field) => SchemaDefinition
): SchemaResult {
  var validation: Record<string, any> = {};

  // Classe dinâmica TypeORM
  @Entity(name)
  class entity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  }

  //define o nome da classe
  Object.defineProperty(entity, "name", { value: name });

  const definitions = definition(new Field());
  for (const [key, field] of Object.entries(definitions)) {
    /*let schema: any;

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
      case "relation":
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
    validation[key] = schema;*/

    //decorators
    var relation = field._settings.relation;

    //@ts-ignore
    if (field.type === Type.relation) {
      if (!relation) {
        throw new Error(
          "[relation]: Unabled properties for relationship tables in schema"
        );
      }

      switch (relation.type) {
        case "one-to-many":
          OneToMany(relation.target, relation.inverseSide, {
            cascade: relation.cascade,
          })(entity.prototype, key);

          break;

        case "many-to-one":
          ManyToOne(relation.target, relation.inverseSide, {
            cascade: relation.cascade,
          })(entity.prototype, key);

          if (relation.joinColumn) {
            JoinColumn()(entity.prototype, key);
          }
          break;

        case "one-to-one":
          OneToOne(relation.target, relation.inverseSide, {
            nullable: field._settings.required,
            cascade: relation.cascade,
          })(entity.prototype, key);

          if (relation.joinColumn) {
            JoinColumn()(entity.prototype, key);
          }
          break;

        case "many-to-many":
          ManyToMany(relation.target, relation.inverseSide, {
            cascade: relation.cascade,
          })(entity.prototype, key);

          if (relation.joinTable) {
            JoinTable()(entity.prototype, key);
          }
          break;

        default:
          throw new Error("[relation]: Unabled type relationship in schema");
      }
    } else {
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
        length: field._settings.length,
        default: field._settings.default,
        nullable: !field._settings.required,
      });

      // aplica o decorator manualmente
      decorator(entity.prototype, key);
    }
  }

  return {
    //@ts-ignore
    entity,
    validation,
    definitions,
  };
}
