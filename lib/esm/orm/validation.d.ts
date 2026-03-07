export type ValidationFunction = (value: unknown, context: object) => string | null;
export declare class FieldValidator {
    protected _type: string | null;
    protected _cases: ValidationFunction[];
    protected _default: any;
    get type(): string | null;
    get defaultValue(): any;
    default(value: any): this;
    when(test: ValidationFunction): this;
    validate(value: unknown, context: object): string[];
}
declare class NumberValidator extends FieldValidator {
    constructor(message: string);
    required(message: string): this;
    min(min: number, message: string): this;
    max(max: number, message: string): this;
}
declare class StringValidator extends FieldValidator {
    constructor(message: string);
    required(message: string): this;
    match(regex: RegExp, message: string): this;
}
declare class BooleanValidator extends FieldValidator {
    constructor(message: string);
    required(message: string): this;
}
declare class DateValidator extends FieldValidator {
    constructor(message: string);
    required(message: string): this;
}
declare class JsonValidator extends FieldValidator {
    private children?;
    constructor(children?: Record<string, FieldValidator> | undefined);
    validate(value: any, context: object): string[];
}
export declare class ValidationBuilder {
    string(message: string): StringValidator;
    number(message: string): NumberValidator;
    boolean(message: string): BooleanValidator;
    date(message: string): DateValidator;
    json(schema: Record<string, FieldValidator>): JsonValidator;
}
export declare const f: () => ValidationBuilder;
export {};
