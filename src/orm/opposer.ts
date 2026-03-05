import { EntityMetadata, FieldMetadata, MetadataStore } from "./metadata.js";
import { Repository } from "./repository.js";

export interface DatabaseDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  createTable(entity: EntityMetadata, fields: FieldMetadata[]): Promise<void>;
}

export interface ConnectionOptions {
  type: "postgres" | "sqlite" | "mysql";
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database: string;
  logging?: boolean;
}

export class OpposerDatabase {
  constructor(
    private driver: DatabaseDriver,
    private entities: Function[]
  ) {}

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

  getRepository<T>(target: new (...args: any[]) => T): Repository<T> {
    return new Repository<T>(this, target);
  }
}
