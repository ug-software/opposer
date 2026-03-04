export type ValidationFunction = (value: unknown, context: object) => string | null;

export class FieldValidator {
  protected _type: string | null = null;
  protected _cases: ValidationFunction[] = [];
  protected _default: any = undefined;

  get type() { return this._type; }
  get defaultValue() { return this._default; }

  default(value: any) {
    this._default = value;
    return this;
  }

  when(test: ValidationFunction) {
    this._cases.push(test);
    return this;
  }

  validate(value: unknown, context: object): string[] {
    return this._cases
      .map((fn) => fn(value, context))
      .filter((res): res is string => res !== null);
  }
}

class NumberValidator extends FieldValidator {
  constructor(message: string) {
    super();
    this._type = "number";
    this._cases.push((value) => typeof value !== "number" ? message : null);
  }

  required(message: string) {
    this._cases.push((value) => (value === undefined || value === null || String(value).trim() === "") ? message : null);
    return this;
  }

  min(min: number, message: string) {
    this._cases.push((value) => (typeof value === "number" && value < min) ? message : null);
    return this;
  }

  max(max: number, message: string) {
    this._cases.push((value) => (typeof value === "number" && value > max) ? message : null);
    return this;
  }
}

class StringValidator extends FieldValidator {
  constructor(message: string) {
    super();
    this._type = "string";
    this._cases.push((value) => typeof value !== "string" ? message : null);
  }

  required(message: string) {
    this._cases.push((value) => (!value || String(value).trim() === "") ? message : null);
    return this;
  }

  match(regex: RegExp, message: string) {
    this._cases.push((value) => !regex.test(String(value)) ? message : null);
    return this;
  }
}

class BooleanValidator extends FieldValidator {
  constructor(message: string) {
    super();
    this._type = "boolean";
    this._cases.push((value) => typeof value !== "boolean" ? message : null);
  }

  required(message: string) {
    this._cases.push((value) => typeof value !== "boolean" ? message : null);
    return this;
  }
}

class DateValidator extends FieldValidator {
  constructor(message: string) {
    super();
    this._type = "date";
    this._cases.push((value) => {
      if (!value) return message;
      const d = new Date(value as any);
      return isNaN(d.getTime()) ? message : null;
    });
  }

  required(message: string) {
    return this.when((value) => !value ? message : null);
  }
}

class JsonValidator extends FieldValidator {
  constructor(private children?: Record<string, FieldValidator>) {
    super();
    this._type = "jsonb";
  }

  validate(value: any, context: object): string[] {
    if (typeof value !== "object" || value === null) {
      return ["Must be a valid JSON object."];
    }
    if (!this.children) return [];

    const errors: string[] = [];
    for (const [key, validator] of Object.entries(this.children)) {
      const childErrors = validator.validate(value[key], context);
      errors.push(...childErrors.map((e) => `${key}: ${e}`));
    }
    return errors;
  }
}

export class ValidationBuilder {
  string(message: string) { return new StringValidator(message); }
  number(message: string) { return new NumberValidator(message); }
  boolean(message: string) { return new BooleanValidator(message); }
  date(message: string) { return new DateValidator(message); }
  json(schema: Record<string, FieldValidator>) { return new JsonValidator(schema); }
}

export const f = () => new ValidationBuilder();
