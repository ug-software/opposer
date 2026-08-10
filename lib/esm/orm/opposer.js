import { MetadataStore } from "./metadata.js";
import { Repository } from "./repository.js";
export class OpposerDatabase {
    constructor(driver, entities) {
        this.driver = driver;
        this.entities = entities;
    }
    async connect() {
        await this.driver.connect();
        // After connecting, ensure tables exist (simplified sync for now)
        for (const entity of this.entities) {
            const metadata = MetadataStore.getEntity(entity);
            const fields = MetadataStore.getPersistableFields(entity);
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
        return new Repository(this, target);
    }
}
