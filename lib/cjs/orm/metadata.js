"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataStore = exports.HOOK_METADATA_KEY = exports.FIELD_METADATA_KEY = exports.ENTITY_METADATA_KEY = void 0;
require("reflect-metadata");
exports.ENTITY_METADATA_KEY = Symbol("orm:entity");
exports.FIELD_METADATA_KEY = Symbol("orm:field");
exports.HOOK_METADATA_KEY = Symbol("orm:hook");
class MetadataStore {
    static registerEntity(target, metadata) {
        this.entities.set(target, metadata);
    }
    static registerField(target, metadata) {
        const fields = this.fields.get(target) || [];
        fields.push(metadata);
        this.fields.set(target, fields);
    }
    static registerHook(target, hook) {
        const hooks = this.hooks.get(target) || [];
        hooks.push(hook);
        this.hooks.set(target, hooks);
    }
    static getEntity(target) {
        return this.entities.get(target);
    }
    static getFields(target) {
        return this.fields.get(target) || [];
    }
    static getPersistableFields(target) {
        const fields = this.getFields(target);
        return fields.filter((field) => {
            if (field.type === "relation") {
                return field.relation?.type !== "one-to-many" && field.relation?.type !== "many-to-many";
            }
            return true;
        });
    }
    static getHooks(target) {
        return this.hooks.get(target) || [];
    }
    static getAllEntities() {
        return Array.from(this.entities.values());
    }
}
exports.MetadataStore = MetadataStore;
MetadataStore.entities = new Map();
MetadataStore.fields = new Map();
MetadataStore.hooks = new Map();
