import { ObjectType } from "typeorm";
import { ValidationFunction, SettingsField } from "../interfaces/field";
import { SchemaDefinition } from "../interfaces/schema";
import { generic } from "../factory/index.js";

export class ToolField {
  type!: "string" | "boolean" | "date" | "number" | "relation" | "jsonb" | null;
  _cases: ValidationFunction[] = [];
  _settings: SettingsField = {};

  default(value: any) {
    this._settings.default = value;

    return this;
  }

  when(test: (value: unknown, context: object) => string | null) {
    this._cases.push(test);

    return this;
  }

  validate(value: unknown, context: object): string[] {
    return this._cases
      .map((fnx) => fnx(value, context))
      .filter((x) => x !== null);
  }
}

class NumberField extends ToolField {
  constructor(message: string) {
    super();

    this.type = "number";

    this._cases.push((value: unknown) => {
      if (typeof value !== "number") {
        return message;
      }

      return null;
    });
  }

  required(message: string) {
    this._cases.push((value: unknown) => {
      if ((value as number).toString().trim() === "") {
        return message;
      }

      return null;
    });

    return this;
  }

  min(min: number, message: string) {
    this._cases.push((value: unknown) => {
      if (min > (value as number)) {
        return message;
      }

      return null;
    });

    return this;
  }

  max(max: number, message: string) {
    this._cases.push((value: unknown) => {
      if (max > (value as number)) {
        return message;
      }

      return null;
    });

    return this;
  }
}

class StringField extends ToolField {
  constructor(message: string) {
    super();
    this.type = "string";

    this._cases.push((value: unknown) => {
      if (typeof value !== "string") {
        return message;
      }

      return null;
    });
  }

  required(message: string) {
    this._cases.push((value: unknown) => {
      if ((value as string).trim() === "") {
        return message;
      }

      return null;
    });

    return this;
  }

  match(regex: RegExp, message: string) {
    this._cases.push((value: unknown) => {
      var _value = String(value);
      if (!regex.test(_value)) {
        return message;
      }

      return null;
    });

    return this;
  }
}

class BooleanField extends ToolField {
  constructor(message: string) {
    super();
    this.type = "boolean";

    this._cases.push((value: unknown) => {
      if (typeof value !== "boolean") {
        return message;
      }

      return null;
    });
  }

  required(message: string) {
    this._cases.push((value: unknown) => {
      if (typeof value !== "boolean") {
        return message;
      }

      return null;
    });

    return this;
  }
}

class DateField extends ToolField {
  constructor(message: string) {
    super();

    this.type = "date";
    this._cases.push((value: unknown) => {
      if (!value) {
        return message;
      }

      const data = new Date(value as Date);
      if (isNaN(data.getTime())) {
        return message;
      }

      return null;
    });
  }

  required(message: string) {
    this._cases.push((value: unknown) => {
      if (!value) {
        return message;
      }

      const data = new Date(value as Date);
      if (isNaN(data.getTime())) {
        return message;
      }

      return null;
    });

    return this;
  }
}

class RelationalField extends ToolField {
  constructor() {
    super();

    this.type = "relation";
    this._settings.relation = {
      type: null,
      inverseSide: "",
      target: () => generic(),
    };
  }

  target(target: () => ObjectType<unknown>) {
    this._settings.relation!.target = target;

    return this;
  }

  oneToOne() {
    this._settings.relation!.type = "one-to-one";

    return this;
  }

  manyToMany() {
    this._settings.relation!.type = "many-to-many";

    return this;
  }

  oneToMany() {
    this._settings.relation!.type = "one-to-one";

    return this;
  }

  manyToOne() {
    this._settings.relation!.type = "many-to-one";

    return this;
  }

  inverseSide(target: string) {
    this._settings.relation!.inverseSide = target;

    return this;
  }

  joinColumn(isJoin: boolean) {
    this._settings.relation!.joinColumn = isJoin;

    return this;
  }

  joinTable(isJoinTable: boolean) {
    this._settings.relation!.joinTable = isJoinTable;

    return this;
  }

  cascade(isCascade: boolean) {
    this._settings.relation!.cascade = isCascade;

    return this;
  }
}

class JsonField extends ToolField {
  private _children: SchemaDefinition = {};

  constructor(children: SchemaDefinition) {
    super();
    this.type = "jsonb";
    this._children = children;
  }

  validate(value: any, context: object): string[] {
    const errors: string[] = [];

    if (typeof value !== "object" || value === null) {
      return ["Valor deve ser um objeto JSON válido."];
    }

    for (const [key, child] of Object.entries(this._children)) {
      const childValue = value[key];
      const childErrors = child.validate(childValue, context);
      errors.push(...childErrors.map((e) => `${key}: ${e}`));
    }

    return errors;
  }
}

export default class Field {
  string(message: string) {
    return new StringField(message);
  }

  date(message: string) {
    return new DateField(message);
  }

  number(message: string) {
    return new NumberField(message);
  }

  boolean(message: string) {
    return new BooleanField(message);
  }

  /*relation() {
    return new RelationalField();
  }*/

  json(fields: SchemaDefinition) {
    return new JsonField(fields);
  }

  static object() {
    return new Field()
  }
}
