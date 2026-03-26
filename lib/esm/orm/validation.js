export class FieldValidator {
    constructor() {
        this._type = null;
        this._cases = [];
        this._default = undefined;
    }
    get type() {
        return this._type;
    }
    get defaultValue() {
        return this._default;
    }
    default(value) {
        this._default = value;
        return this;
    }
    when(test) {
        this._cases.push(test);
        return this;
    }
    validate(value, context) {
        return this._cases.map((fn) => fn(value, context)).filter((res) => res !== null);
    }
}
class NumberValidator extends FieldValidator {
    constructor(message) {
        super();
        this._type = 'number';
        this._cases.push((value) => (value === null || value === undefined ? null : typeof value !== 'number' ? message : null));
    }
    required(message) {
        this._cases.push((value) => (value === undefined || value === null || String(value).trim() === '' ? message : null));
        return this;
    }
    min(min, message) {
        this._cases.push((value) => (typeof value === 'number' && value < min ? message : null));
        return this;
    }
    max(max, message) {
        this._cases.push((value) => (typeof value === 'number' && value > max ? message : null));
        return this;
    }
}
class StringValidator extends FieldValidator {
    constructor(message) {
        super();
        this._type = 'string';
        this._cases.push((value) => (value === null || value === undefined ? null : typeof value !== 'string' ? message : null));
    }
    required(message) {
        this._cases.push((value) => (!value || String(value).trim() === '' ? message : null));
        return this;
    }
    match(regex, message) {
        this._cases.push((value) => (value === null || value === undefined ? null : !regex.test(String(value)) ? message : null));
        return this;
    }
}
class BooleanValidator extends FieldValidator {
    constructor(message) {
        super();
        this._type = 'boolean';
        this._cases.push((value) => (value === null || value === undefined ? null : typeof value !== 'boolean' ? message : null));
    }
    required(message) {
        this._cases.push((value) => (typeof value !== 'boolean' ? message : null));
        return this;
    }
}
class DateValidator extends FieldValidator {
    constructor(message) {
        super();
        this._type = 'date';
        this._cases.push((value) => {
            if (value === null || value === undefined)
                return null;
            const d = new Date(value);
            return isNaN(d.getTime()) ? message : null;
        });
    }
    required(message) {
        return this.when((value) => (!value ? message : null));
    }
}
class JsonValidator extends FieldValidator {
    constructor(children) {
        super();
        this.children = children;
        this._type = 'jsonb';
    }
    validate(value, context) {
        if (typeof value !== 'object' || value === null) {
            return ['Must be a valid JSON object.'];
        }
        if (!this.children)
            return [];
        const errors = [];
        for (const [key, validator] of Object.entries(this.children)) {
            const childErrors = validator.validate(value[key], context);
            errors.push(...childErrors.map((e) => `${key}: ${e}`));
        }
        return errors;
    }
}
export class ValidationBuilder {
    string(message) {
        return new StringValidator(message);
    }
    number(message) {
        return new NumberValidator(message);
    }
    boolean(message) {
        return new BooleanValidator(message);
    }
    date(message) {
        return new DateValidator(message);
    }
    json(model) {
        return new JsonValidator(model);
    }
}
export const f = () => new ValidationBuilder();
