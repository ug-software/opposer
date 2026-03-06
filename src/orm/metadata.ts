import "reflect-metadata";

export const ENTITY_METADATA_KEY = Symbol("orm:entity");
export const FIELD_METADATA_KEY = Symbol("orm:field");
export const HOOK_METADATA_KEY = Symbol("orm:hook");

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
  validation?: any; // To store validation logic from the project
}

export interface HookMetadata {
  type: "before-insert" | "after-insert" | "before-update" | "after-update";
  propertyKey: string;
}

export class MetadataStore {
  private static entities = new Map<Function, EntityMetadata>();
  private static fields = new Map<Function, FieldMetadata[]>();
  private static hooks = new Map<Function, HookMetadata[]>();

  static registerEntity(target: Function, metadata: EntityMetadata) {
    this.entities.set(target, metadata);
  }

  static registerField(target: Function, metadata: FieldMetadata) {
    const fields = this.fields.get(target) || [];
    fields.push(metadata);
    this.fields.set(target, fields);
  }

  static registerHook(target: Function, hook: HookMetadata) {
    const hooks = this.hooks.get(target) || [];
    hooks.push(hook);
    this.hooks.set(target, hooks);
  }

  static getEntity(target: Function): EntityMetadata | undefined {
    return this.entities.get(target);
  }

  static getFields(target: Function): FieldMetadata[] {
    return this.fields.get(target) || [];
  }

  static getPersistableFields(target: Function): FieldMetadata[] {
    const fields = this.getFields(target);
    return fields.filter((field) => {
      if (field.type === "relation") {
        return field.relation?.type !== "one-to-many" && field.relation?.type !== "many-to-many";
      }
      return true;
    });
  }

  static getHooks(target: Function): HookMetadata[] {
    return this.hooks.get(target) || [];
  }

  static getAllEntities(): EntityMetadata[] {
    return Array.from(this.entities.values());
  }
}
