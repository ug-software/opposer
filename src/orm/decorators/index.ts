import { ENTITY_METADATA_KEY, MetadataStore, FieldType, HOOK_METADATA_KEY } from "../metadata.js";
import { FieldValidator } from "../validation.js";

export interface EntityOptions {
  description?: string;
}

export function Entity(tableName: string, optionsOrDescription?: EntityOptions | string) {
  return (target: any, context?: any) => {
    const description = typeof optionsOrDescription === 'string' 
      ? optionsOrDescription 
      : optionsOrDescription?.description;

    // Standard Class Decorator
    if (context && typeof context === 'object' && context.kind === "class") {
      MetadataStore.registerEntity(target, {
        name: target.name,
        tableName,
        target,
        description,
      });
      return;
    }

    // Legacy Class Decorator
    MetadataStore.registerEntity(target, {
      name: target.name,
      tableName,
      target,
      description,
    });
    Reflect.defineMetadata(ENTITY_METADATA_KEY, tableName, target);
  };
}

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

export function Field(optionsOrValidation?: FieldOptions | (() => FieldValidator)) {
  return (target: any, contextOrKey: any) => {
    let options: FieldOptions = {};
    if (typeof optionsOrValidation === "function") {
      options = { validation: optionsOrValidation };
    } else if (optionsOrValidation) {
      options = optionsOrValidation;
    }

    // Legacy Property Decorator
    if (typeof contextOrKey === "string") {
      const propertyKey = contextOrKey;
      const constructor = target.constructor;

      let type = options.type;
      let defaultValue = options.default;

      if (options.validation) {
        const validator = options.validation();
        if (!type) type = validator.type as FieldType;
        if (defaultValue === undefined) defaultValue = validator.defaultValue;
      }

      if (!type) {
        const reflectedType = Reflect.getMetadata("design:type", target, propertyKey);
        if (reflectedType === String) type = "string";
        else if (reflectedType === Number) type = "number";
        else if (reflectedType === Boolean) type = "boolean";
        else if (reflectedType === Date) type = "date";
        else type = "string";
      }

      MetadataStore.registerField(constructor, {
        name: propertyKey,
        propertyKey,
        type,
        ...options,
        default: defaultValue
      });
      return;
    }

    // Standard Property Decorator (Stage 3)
    if (contextOrKey && typeof contextOrKey === 'object' && contextOrKey.kind === "field") {
      const propertyKey = contextOrKey.name as string;
      
      contextOrKey.addInitializer(function(this: any) {
        const constructor = this.constructor;
        
        let type = options.type;
        let defaultValue = options.default;
        if (options.validation) {
          const validator = options.validation();
          if (!type) type = validator.type as FieldType;
          if (defaultValue === undefined) defaultValue = validator.defaultValue;
        }

        MetadataStore.registerField(constructor, {
          name: propertyKey,
          propertyKey,
          type: type || "string",
          ...options,
          default: defaultValue
        });
      });
    }
  };
}

export function PrimaryColumn(options: FieldOptions = {}) {
  return Field({ ...options, primary: true, generated: options.generated ?? true });
}

export function Relation(options: RelationOptions) {
  return Field({ type: "relation", relation: options });
}

export function CreateDateColumn() {
  return Field({ type: "date", createDate: true });
}

export function UpdateDateColumn() {
  return Field({ type: "date", updateDate: true });
}

// Lifecycle Hooks
function Hook(type: "before-insert" | "after-insert" | "before-update" | "after-update") {
  return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
    const constructor = typeof target === 'function' ? target : target.constructor;
    MetadataStore.registerHook(constructor, { type, propertyKey });
  };
}

export const BeforeInsert = () => Hook("before-insert");
export const AfterInsert = () => Hook("after-insert");
export const BeforeUpdate = () => Hook("before-update");
export const AfterUpdate = () => Hook("after-update");
