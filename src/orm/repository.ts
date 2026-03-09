import { OpposerDatabase, QueryResultRow } from './opposer.js';
import { MetadataStore, EntityMetadata, FieldMetadata } from './metadata.js';
import { QueryTranslator } from './query-builder.js';
import { QueryBuilder as OpposerQueryBuilder, RelationBuilder } from '../interfaces/controller.js';
import crypto from 'crypto';

export class Repository<T> {
  private metadata: EntityMetadata;
  private fields: FieldMetadata[];
  private translator: QueryTranslator;

  constructor(private connection: OpposerDatabase, private target: Function) {
    const metadata = MetadataStore.getEntity(target);
    const fields = MetadataStore.getFields(target);
    if (!metadata) {
      throw new Error(`Entity metadata not found for ${target.name}`);
    }
    this.metadata = metadata;
    this.fields = fields;
    this.translator = new QueryTranslator(this.metadata, this.fields, this.connection.getDriver());
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
    relation?: (string | RelationBuilder)[];
  }): Promise<T[]> {
    const driver = this.connection.getDriver();
    const selectParts: string[] = [];

    // Main entity select
    selectParts.push(this.translator.translateSelect(options.select || []));

    // Relations
    const relationResult = this.translator.translateRelations(options.relation || []);
    if (relationResult.select.length > 0) {
      selectParts.push(...relationResult.select);
    }

    const { sql: where, params, joins: whereJoins } = this.translator.translateFilter(options.where || {});
    const pagination = this.translator.translatePagination(options.pagination);

    const allJoins = new Set(relationResult.joins);
    
    // Add missing joins from where clause
    if (whereJoins.size > 0) {
      const neededJoins = Array.from(whereJoins);
      // We need to translate these joins if they are not already in allJoins
      // For simplicity, let's assume translateRelations can be called for individual relations
      const missingJoinsResult = this.translator.translateRelations(neededJoins.filter(rj => !options.relation?.some(r => (typeof r === 'string' ? r === rj : r.model === rj))));
      missingJoinsResult.joins.forEach(j => allJoins.add(j));
    }

    const joinsSql = Array.from(allJoins).join(' ');
    const sql = `SELECT ${selectParts.join(', ')} FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${joinsSql} ${where} ${pagination};`;
    const results = await driver.query(sql, params);

    const primaryFields = this.fields.filter((f) => f.primary);
    const entitiesMap = new Map<string, T>();

    for (const row of results) {
      const pk = primaryFields.map((f) => row[f.name]).join(':');
      if (!entitiesMap.has(pk)) {
        entitiesMap.set(pk, this.reconstruct(row));
      } else {
        const existing = entitiesMap.get(pk)!;
        this.merge(existing, row);
      }
    }

    return Array.from(entitiesMap.values());
  }

  async findOne(options: { where?: OpposerQueryBuilder; select?: string[]; relation?: (string | RelationBuilder)[] }): Promise<T | null> {
    const results = await this.find({
      ...options,
      pagination: { page: 0, take: 1 },
    });
    return results.length > 0 ? results[0] : null;
  }

  private reconstruct(row: QueryResultRow): T {
    const entity = new (this.target as any)();
    this.merge(entity, row);
    return entity;
  }

  private merge(entity: any, row: QueryResultRow) {
    for (const [key, value] of Object.entries(row)) {
      if (key.includes('.')) {
        const parts = key.split('.');
        let current = entity;
        let currentTarget = this.target;

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          const relationField = MetadataStore.getFields(currentTarget).find((f) => f.name === part);

          if (relationField && relationField.relation) {
            const isArray = relationField.relation.type === 'one-to-many' || relationField.relation.type === 'many-to-many';
            const nextTarget = relationField.relation.target();

            if (isArray) {
              if (!Array.isArray(current[part])) {
                current[part] = [];
              }
              
              // We need to find if the item already exists in the array
              // To do that we need the primary key of the target entity
              const targetFields = MetadataStore.getFields(nextTarget);
              const targetPrimaryFields = targetFields.filter(f => f.primary);
              
              // Find child row values for child PK
              const childPkValues: any = {};
              let hasAnyValue = false;
              targetPrimaryFields.forEach(pf => {
                const fullKey = [...parts.slice(0, i + 1), pf.name].join('.');
                if (row[fullKey] !== undefined && row[fullKey] !== null) {
                   childPkValues[pf.name] = row[fullKey];
                   hasAnyValue = true;
                }
              });

              if (!hasAnyValue) {
                // If all PK fields of the relation are null, it means there's no related record (LEFT JOIN result)
                break; 
              }

              let existingChild = current[part].find((item: any) => {
                return targetPrimaryFields.every(pf => item[pf.name] === childPkValues[pf.name]);
              });

              if (!existingChild) {
                existingChild = new (nextTarget as any)();
                current[part].push(existingChild);
              }
              
              current = existingChild;
              currentTarget = nextTarget;
            } else {
              if (typeof current[part] === 'string' || current[part] === undefined || current[part] === null) {
                const id = typeof current[part] === 'string' ? current[part] : undefined;
                current[part] = id ? { id } : new (nextTarget as any)();
              }
              current = current[part];
              currentTarget = nextTarget;
            }
          } else {
            // Fallback for non-metadata relations (should not happen with decorators)
            if (current[part] === undefined || current[part] === null) {
              current[part] = {};
            }
            current = current[part];
          }
        }

        const lastPart = parts[parts.length - 1];
        if (value !== null || current[lastPart] === undefined) {
           current[lastPart] = value;
        }
      } else {
        if (value === null && typeof entity[key] === 'object' && entity[key] !== null) {
          continue;
        }
        entity[key] = value;
      }
    }
  }



  private async executeHooks(type: 'before-insert' | 'before-update', entity: T) {
    const hooks = MetadataStore.getHooks(this.target).filter((h) => {
      return h.type === type;
    });
    for (const hook of hooks) {
      const method = (entity as any)[hook.propertyKey];
      if (typeof method === 'function') {
        await method.apply(entity);
      }
    }
  }

  async insert(data: Partial<T>): Promise<T> {
    const entity = Object.assign(new (this.target as any)(), data);

    // Execute hooks
    await this.executeHooks('before-insert', entity);

    const persistableFields = MetadataStore.getPersistableFields(this.target);
    const now = new Date();

    for (const field of persistableFields) {
      if (field.createDate || field.updateDate) {
        if ((entity as any)[field.name] === undefined) {
          (entity as any)[field.name] = now;
        }
      }
      if (field.generated && field.type === 'uuid' && (entity as any)[field.name] === undefined) {
        (entity as any)[field.name] = crypto.randomUUID();
      }
    }

    const persistableKeys = persistableFields.map((f) => {
      return f.name;
    });
    const keys = Object.keys(entity).filter((k) => {
      return persistableKeys.includes(k) || k === 'id';
    });
    const values = keys.map((k) => {
      return (entity as any)[k];
    });
    const driver = this.connection.getDriver();
    const placeholders = keys
      .map((_, i) => {
        return `$${i + 1}`;
      })
      .join(', ');
    const columns = keys
      .map((k) => {
        return driver.quoteIdentifier(k);
      })
      .join(', ');

    const isSqlite = driver.constructor.name === 'SQLiteDriver';

    if (isSqlite) {
      const sql = `INSERT INTO ${driver.quoteIdentifier(this.metadata.tableName)} (${columns}) VALUES (${placeholders});`;
      await driver.query(sql, values);

      // Fetch the inserted record using primary key(s)
      const primaryFields = this.fields.filter((f) => {
        return f.primary;
      });
      const where: any = {};
      primaryFields.forEach((f) => {
        where[f.name] = (entity as any)[f.name];
      });

      return (await this.findOne({ where })) as T;
    } else {
      const sql = `INSERT INTO ${driver.quoteIdentifier(this.metadata.tableName)} (${columns}) VALUES (${placeholders}) RETURNING *;`;
      const result = await driver.query<T>(sql, values);
      return result[0];
    }
  }

  async update(where: OpposerQueryBuilder, data: Partial<T>): Promise<void> {
    const entity = Object.assign(new (this.target as any)(), data);
    await this.executeHooks('before-update', entity);

    const persistableFields = MetadataStore.getPersistableFields(this.target);
    const now = new Date();

    for (const field of persistableFields) {
      if (field.updateDate) {
        (entity as any)[field.name] = now;
      }
    }

    const driver = this.connection.getDriver();
    const persistableKeys = persistableFields.map((f) => {
      return f.name;
    });
    const setKeys = Object.keys(entity).filter((k) => {
      return persistableKeys.includes(k);
    });
    const setValues = setKeys.map((k) => {
      return (entity as any)[k];
    });
    const setSql = setKeys
      .map((k, i) => {
        return `${driver.quoteIdentifier(k)} = $${i + 1}`;
      })
      .join(', ');

    const { sql: whereSql, params: whereParams } = this.translator.translateFilter(where);

    // Adjust whereParams placeholders
    const adjustedWhereSql = whereSql.replace(/\$(\d+)/g, (_, n) => {
      return `$${parseInt(n) + setValues.length}`;
    });
    const sql = `UPDATE ${driver.quoteIdentifier(this.metadata.tableName)} SET ${setSql} ${adjustedWhereSql};`;

    await driver.query(sql, [...setValues, ...whereParams]);
  }

  async delete(where: OpposerQueryBuilder): Promise<void> {
    const driver = this.connection.getDriver();
    const { sql: whereSql, params } = this.translator.translateFilter(where);
    const sql = `DELETE FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
    await driver.query(sql, params);
  }

  async count(where: OpposerQueryBuilder): Promise<number> {
    const driver = this.connection.getDriver();
    const { sql: whereSql, params } = this.translator.translateFilter(where);
    const sql = `SELECT COUNT(*) as count FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
    const result = await driver.query(sql, params);
    return parseInt((result[0] as any).count);
  }

  async exists(where: OpposerQueryBuilder): Promise<boolean> {
    const driver = this.connection.getDriver();
    const { sql: whereSql, params } = this.translator.translateFilter(where);
    const sql = `SELECT 1 FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql} LIMIT 1;`;
    const result = await driver.query(sql, params);
    return result.length > 0;
  }

  async aggregate(options: { where?: OpposerQueryBuilder; aggregate: { [key: string]: 'sum' | 'avg' | 'min' | 'max' | 'count' } }): Promise<any> {
    const driver = this.connection.getDriver();
    const { sql: whereSql, params } = this.translator.translateFilter(options.where || {});
    const aggregateSql = this.translator.translateAggregate(options.aggregate);
    const sql = `SELECT ${aggregateSql} FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
    const result = await driver.query(sql, params);
    return result[0];
  }

  async distinct(options: { where?: OpposerQueryBuilder; field: string }): Promise<any[]> {
    const driver = this.connection.getDriver();
    const { sql: whereSql, params } = this.translator.translateFilter(options.where || {});
    const sql = `SELECT DISTINCT ${driver.quoteIdentifier(options.field)} FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
    const result = await driver.query(sql, params);
    return result.map((r) => {
      return r[options.field];
    });
  }

  async group(options: { where?: OpposerQueryBuilder; by: string[]; aggregate?: { [key: string]: 'sum' | 'avg' | 'min' | 'max' | 'count' }; select?: string[] }): Promise<any[]> {
    const driver = this.connection.getDriver();
    const { sql: whereSql, params } = this.translator.translateFilter(options.where || {});
    const groupSql = this.translator.translateGroup(options.by);

    let selectParts: string[] = [];
    if (options.select) {
      selectParts.push(this.translator.translateSelect(options.select));
    } else {
      selectParts.push(
        options.by
          .map((f) => {
            return driver.quoteIdentifier(f);
          })
          .join(', '),
      );
    }

    if (options.aggregate) {
      selectParts.push(this.translator.translateAggregate(options.aggregate));
    }

    const sql = `SELECT ${selectParts.join(', ')} FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql} ${groupSql};`;
    return await driver.query(sql, params);
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
