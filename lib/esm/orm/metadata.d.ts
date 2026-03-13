import "reflect-metadata";
export declare const ENTITY_METADATA_KEY: unique symbol;
export declare const FIELD_METADATA_KEY: unique symbol;
export declare const HOOK_METADATA_KEY: unique symbol;
export type FieldType = "string" | "number" | "boolean" | "date" | "jsonb" | "uuid" | "relation";
export interface EntityMetadata {
    name: string;
    tableName: string;
    target: Function;
    description?: string;
}
export interface FieldMetadata {
    name: string;
    propertyKey: string;
    type: FieldType;
    primary?: boolean;
    generated?: boolean;
    nullable?: boolean;
    default?: any;
    length?: number;
    createDate?: boolean;
    updateDate?: boolean;
    relation?: {
        type: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
        target: () => Function;
        inverseSide?: string;
        joinColumn?: boolean;
    };
    validation?: any;
}
export interface HookMetadata {
    type: "before-insert" | "after-insert" | "before-update" | "after-update";
    propertyKey: string;
}
export declare class MetadataStore {
    private static entities;
    private static fields;
    private static hooks;
    static registerEntity(target: Function, metadata: EntityMetadata): void;
    static registerField(target: Function, metadata: FieldMetadata): void;
    static registerHook(target: Function, hook: HookMetadata): void;
    static getEntity(target: Function): EntityMetadata | undefined;
    static getFields(target: Function): FieldMetadata[];
    static getPersistableFields(target: Function): FieldMetadata[];
    static getHooks(target: Function): HookMetadata[];
    static getAllEntities(): EntityMetadata[];
}
