"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterUpdate = exports.BeforeUpdate = exports.AfterInsert = exports.BeforeInsert = void 0;
exports.Entity = Entity;
exports.Field = Field;
exports.PrimaryColumn = PrimaryColumn;
exports.Relation = Relation;
exports.CreateDateColumn = CreateDateColumn;
exports.UpdateDateColumn = UpdateDateColumn;
const metadata_js_1 = require("../metadata.js");
function Entity(tableName, optionsOrDescription) {
    return (target, context) => {
        const description = typeof optionsOrDescription === 'string'
            ? optionsOrDescription
            : optionsOrDescription?.description;
        // Standard Class Decorator
        if (context && typeof context === 'object' && context.kind === "class") {
            metadata_js_1.MetadataStore.registerEntity(target, {
                name: target.name,
                tableName,
                target,
                description,
            });
            return;
        }
        // Legacy Class Decorator
        metadata_js_1.MetadataStore.registerEntity(target, {
            name: target.name,
            tableName,
            target,
            description,
        });
        Reflect.defineMetadata(metadata_js_1.ENTITY_METADATA_KEY, tableName, target);
    };
}
function Field(optionsOrValidation) {
    return (target, contextOrKey) => {
        let options = {};
        if (typeof optionsOrValidation === "function") {
            options = { validation: optionsOrValidation };
        }
        else if (optionsOrValidation) {
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
                if (!type)
                    type = validator.type;
                if (defaultValue === undefined)
                    defaultValue = validator.defaultValue;
            }
            if (!type) {
                const reflectedType = Reflect.getMetadata("design:type", target, propertyKey);
                if (reflectedType === String)
                    type = "string";
                else if (reflectedType === Number)
                    type = "number";
                else if (reflectedType === Boolean)
                    type = "boolean";
                else if (reflectedType === Date)
                    type = "date";
                else
                    type = "string";
            }
            metadata_js_1.MetadataStore.registerField(constructor, {
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
            const propertyKey = contextOrKey.name;
            contextOrKey.addInitializer(function () {
                const constructor = this.constructor;
                let type = options.type;
                let defaultValue = options.default;
                if (options.validation) {
                    const validator = options.validation();
                    if (!type)
                        type = validator.type;
                    if (defaultValue === undefined)
                        defaultValue = validator.defaultValue;
                }
                metadata_js_1.MetadataStore.registerField(constructor, {
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
function PrimaryColumn(options = {}) {
    return Field({ ...options, primary: true, generated: options.generated ?? true });
}
function Relation(options) {
    return Field({ type: "relation", relation: options });
}
function CreateDateColumn() {
    return Field({ type: "date", createDate: true });
}
function UpdateDateColumn() {
    return Field({ type: "date", updateDate: true });
}
// Lifecycle Hooks
function Hook(type) {
    return (target, propertyKey, descriptor) => {
        const constructor = typeof target === 'function' ? target : target.constructor;
        metadata_js_1.MetadataStore.registerHook(constructor, { type, propertyKey });
    };
}
const BeforeInsert = () => Hook("before-insert");
exports.BeforeInsert = BeforeInsert;
const AfterInsert = () => Hook("after-insert");
exports.AfterInsert = AfterInsert;
const BeforeUpdate = () => Hook("before-update");
exports.BeforeUpdate = BeforeUpdate;
const AfterUpdate = () => Hook("after-update");
exports.AfterUpdate = AfterUpdate;
