import { OpposerDatabase } from "./opposer.js";
import { MetadataStore, EntityMetadata, FieldMetadata } from "./metadata.js";
import { QueryTranslator } from "./query-builder.js";
import { QueryBuilder as OpposerQueryBuilder } from "../interfaces/controller.js";
import crypto from "crypto";

export class Repository<T> {
  private metadata: EntityMetadata;
  private fields: FieldMetadata[];
  private translator: QueryTranslator;

  constructor(private connection: OpposerDatabase, private target: Function) {
    const metadata = MetadataStore.getEntity(target);
    const fields = MetadataStore.getFields(target);
    if (!metadata) throw new Error(`Entity metadata not found for ${target.name}`);
    this.metadata = metadata;
    this.fields = fields;
    this.translator = new QueryTranslator(this.metadata, this.fields);
  }

  get Metadata() {
    return this.metadata;
  }

  get Fields() {
    return this.fields;
  }

  async find(options: {
    where?: OpposerQueryBuilder;
    select?: string[];
    pagination?: { page: number; take: number };
  }): Promise<T[]> {
    const select = this.translator.translateSelect(options.select || []);
    const { sql: where, params } = this.translator.translateFilter(options.where || {});
    const pagination = this.translator.translatePagination(options.pagination);

    const sql = `SELECT ${select} FROM "${this.metadata.tableName}" ${where} ${pagination};`;
    const results = await this.connection.getDriver().query<T>(sql, params);
    
    return results.map(row => Object.assign(new (this.target as any)(), row));
  }

  async findOne(options: {
    where?: OpposerQueryBuilder;
    select?: string[];
  }): Promise<T | null> {
    const results = await this.find({ ...options, pagination: { page: 0, take: 1 } });
    return results.length > 0 ? results[0] : null;
  }

  private async executeHooks(type: "before-insert" | "before-update", entity: T) {
    const hooks = MetadataStore.getHooks(this.target).filter(h => h.type === type);
    for (const hook of hooks) {
      const method = (entity as any)[hook.propertyKey];
      if (typeof method === "function") {
        await method.apply(entity);
      }
    }
  }

  async insert(data: Partial<T>): Promise<T> {
    const entity = Object.assign(new (this.target as any)(), data);
    
    // Execute hooks
    await this.executeHooks("before-insert", entity);

    const persistableFields = MetadataStore.getPersistableFields(this.target);
    const now = new Date();

    for (const field of persistableFields) {
      if (field.createDate || field.updateDate) {
        if ((entity as any)[field.name] === undefined) {
            (entity as any)[field.name] = now;
        }
      }
      if (field.generated && field.type === "uuid" && (entity as any)[field.name] === undefined) {
        (entity as any)[field.name] = crypto.randomUUID();
      }
    }

    const persistableKeys = persistableFields.map(f => f.name);
    const keys = Object.keys(entity).filter(k => persistableKeys.includes(k) || k === 'id');
    const values = keys.map(k => (entity as any)[k]);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const columns = keys.map(k => `"${k}"`).join(", ");

    const driver = this.connection.getDriver();
    const isSqlite = driver.constructor.name === "SQLiteDriver";

    if (isSqlite) {
        const sql = `INSERT INTO "${this.metadata.tableName}" (${columns}) VALUES (${placeholders});`;
        await driver.query(sql, values);
        
        // Fetch the inserted record using primary key(s)
        const primaryFields = this.fields.filter(f => f.primary);
        const where: any = {};
        primaryFields.forEach(f => {
            where[f.name] = (entity as any)[f.name];
        });
        
        return await this.findOne({ where }) as T;
    } else {
        const sql = `INSERT INTO "${this.metadata.tableName}" (${columns}) VALUES (${placeholders}) RETURNING *;`;
        const result = await driver.query<T>(sql, values);
        return result[0];
    }
  }

  async update(where: OpposerQueryBuilder, data: Partial<T>): Promise<void> {
    const entity = Object.assign(new (this.target as any)(), data);
    await this.executeHooks("before-update", entity);

    const persistableFields = MetadataStore.getPersistableFields(this.target);
    const now = new Date();

    for (const field of persistableFields) {
        if (field.updateDate) {
            (entity as any)[field.name] = now;
        }
    }

    const persistableKeys = persistableFields.map(f => f.name);
    const setKeys = Object.keys(entity).filter(k => persistableKeys.includes(k));
    const setValues = setKeys.map(k => (entity as any)[k]);
    const setSql = setKeys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");

    const { sql: whereSql, params: whereParams } = this.translator.translateFilter(where);
    
    // Adjust whereParams placeholders
    const adjustedWhereSql = whereSql.replace(/\$(\d+)/g, (_, n) => `$${parseInt(n) + setValues.length}`);
    const sql = `UPDATE "${this.metadata.tableName}" SET ${setSql} ${adjustedWhereSql};`;
    
    await this.connection.getDriver().query(sql, [...setValues, ...whereParams]);
  }

  async delete(where: OpposerQueryBuilder): Promise<void> {
    const { sql: whereSql, params } = this.translator.translateFilter(where);
    const sql = `DELETE FROM "${this.metadata.tableName}" ${whereSql};`;
    await this.connection.getDriver().query(sql, params);
  }

  async count(where: OpposerQueryBuilder): Promise<number> {
    const { sql: whereSql, params } = this.translator.translateFilter(where);
    const sql = `SELECT COUNT(*) as count FROM "${this.metadata.tableName}" ${whereSql};`;
    const result = await this.connection.getDriver().query(sql, params);
    return parseInt((result[0] as any).count);
  }

  validate(data: Partial<T>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    for (const field of this.fields) {
      if (field.validation) {
        const val = field.validation();
        const fieldErrors = val.validate((data as any)[field.name], data);
        if (fieldErrors && fieldErrors.length > 0) {
          errors[field.name] = fieldErrors;
        }
      }
    }
    return errors;
  }
}
