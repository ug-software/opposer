"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpposerDatabase = void 0;
const metadata_js_1 = require("./metadata.js");
const repository_js_1 = require("./repository.js");
class OpposerDatabase {
    constructor(driver, entities) {
        this.driver = driver;
        this.entities = entities;
    }
    async connect() {
        await this.driver.connect();
        // After connecting, ensure tables exist (simplified sync for now)
        for (const entity of this.entities) {
            const metadata = metadata_js_1.MetadataStore.getEntity(entity);
            const fields = metadata_js_1.MetadataStore.getPersistableFields(entity);
            if (metadata) {
                console.log(`-> Creating table "${metadata.tableName}" with fields: ${fields.map(f => f.name).join(", ")}`);
                await this.driver.createTable(metadata, fields);
            }
        }
    }
    getDriver() {
        return this.driver;
    }
    getEntities() {
        return this.entities;
    }
    getRepository(target) {
        return new repository_js_1.Repository(this, target);
    }
}
exports.OpposerDatabase = OpposerDatabase;
