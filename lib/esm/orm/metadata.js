import "reflect-metadata";
export const ENTITY_METADATA_KEY = Symbol("orm:entity");
export const FIELD_METADATA_KEY = Symbol("orm:field");
export const HOOK_METADATA_KEY = Symbol("orm:hook");
export class MetadataStore {
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
MetadataStore.entities = new Map();
MetadataStore.fields = new Map();
MetadataStore.hooks = new Map();
