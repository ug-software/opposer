import * as fieldDecorator from "../decorators/field.js";
export class ToolField {
    constructor() {
        this._cases = [];
        this._settings = {};
    }
    default(value) {
        this._settings.default = value;
        return this;
    }
    when(test) {
        this._cases.push(test);
        return this;
    }
    validate(value, context) {
        return this._cases
            .map((fnx) => fnx(value, context))
            .filter((x) => x !== null);
    }
}
class NumberField extends ToolField {
    constructor(message) {
        super();
        this.type = "number";
        this._cases.push((value) => {
            if (typeof value !== "number") {
                return message;
            }
            return null;
        });
    }
    required(message) {
        this._cases.push((value) => {
            if (!value) {
                return message;
            }
            if (value.toString().trim() === "") {
                return message;
            }
            return null;
        });
        return this;
    }
    min(min, message) {
        this._cases.push((value) => {
            if (min > value) {
                return message;
            }
            return null;
        });
        return this;
    }
    max(max, message) {
        this._cases.push((value) => {
            if (max > value) {
                return message;
            }
            return null;
        });
        return this;
    }
}
class StringField extends ToolField {
    constructor(message) {
        super();
        this.type = "string";
        this._cases.push((value) => {
            if (typeof value !== "string") {
                return message;
            }
            return null;
        });
    }
    required(message) {
        this._cases.push((value) => {
            if (!value) {
                return message;
            }
            if (value.trim() === "") {
                return message;
            }
            return null;
        });
        return this;
    }
    match(regex, message) {
        this._cases.push((value) => {
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
    constructor(message) {
        super();
        this.type = "boolean";
        this._cases.push((value) => {
            if (typeof value !== "boolean") {
                return message;
            }
            return null;
        });
    }
    required(message) {
        this._cases.push((value) => {
            if (typeof value !== "boolean") {
                return message;
            }
            return null;
        });
        return this;
    }
}
class DateField extends ToolField {
    constructor(message) {
        super();
        this.type = "date";
        this._cases.push((value) => {
            if (!value) {
                return message;
            }
            const data = new Date(value);
            if (isNaN(data.getTime())) {
                return message;
            }
            return null;
        });
    }
    required(message) {
        this._cases.push((value) => {
            if (!value) {
                return message;
            }
            const data = new Date(value);
            if (isNaN(data.getTime())) {
                return message;
            }
            return null;
        });
        return this;
    }
}
class JsonField extends ToolField {
    constructor(children) {
        super();
        this._children = {};
        this.type = "jsonb";
        this._children = children;
    }
    validate(value, context) {
        const errors = [];
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
export class Field {
    string(message) {
        return new StringField(message);
    }
    date(message) {
        return new DateField(message);
    }
    number(message) {
        return new NumberField(message);
    }
    boolean(message) {
        return new BooleanField(message);
    }
    /*relation() {
      return new RelationalField();
    }*/
    json(fields) {
        return new JsonField(fields);
    }
    static validate(schema, values) {
        var errors = {};
        var schemas = fieldDecorator.getFieldsMetadata(schema);
        for (var field of schemas) {
            var value = values[field.name];
            var __errors = field.schema.validate(value, values);
            if (Array.isArray(__errors) && __errors.length > 0) {
                errors[field.name] = __errors;
            }
        }
        return errors;
    }
}
export default function () {
    return new Field();
}
