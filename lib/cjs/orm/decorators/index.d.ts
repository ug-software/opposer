import { FieldType } from "../metadata.js";
import { FieldValidator } from "../validation.js";
export interface EntityOptions {
    description?: string;
}
export declare function Entity(tableName: string, optionsOrDescription?: EntityOptions | string): (target: any, context?: any) => void;
export interface RelationOptions {
    type: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
    target: () => Function;
    inverseSide?: string;
    joinColumn?: boolean;
}
export interface FieldOptions {
    type?: FieldType;
    primary?: boolean;
    generated?: boolean;
    nullable?: boolean;
    default?: any;
    length?: number;
    createDate?: boolean;
    updateDate?: boolean;
    relation?: RelationOptions;
    validation?: () => FieldValidator;
}
export declare function Field(optionsOrValidation?: FieldOptions | (() => FieldValidator)): (target: any, contextOrKey: any) => void;
export declare function PrimaryColumn(options?: FieldOptions): (target: any, contextOrKey: any) => void;
export declare function Relation(options: RelationOptions): (target: any, contextOrKey: any) => void;
export declare function CreateDateColumn(): (target: any, contextOrKey: any) => void;
export declare function UpdateDateColumn(): (target: any, contextOrKey: any) => void;
export declare const BeforeInsert: () => (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void;
export declare const AfterInsert: () => (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void;
export declare const BeforeUpdate: () => (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void;
export declare const AfterUpdate: () => (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void;
