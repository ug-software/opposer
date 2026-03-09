import { MetadataStore } from './metadata.js';
import { QueryTranslator } from './query-builder.js';
import crypto from 'crypto';
export class Repository {
    constructor(connection, target) {
        this.connection = connection;
        this.target = target;
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
    async find(options) {
        const driver = this.connection.getDriver();
        const selectParts = [];
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
        return results.map((row) => {
            return this.reconstruct(row);
        });
    }
    async findOne(options) {
        const results = await this.find({
            ...options,
            pagination: { page: 0, take: 1 },
        });
        return results.length > 0 ? results[0] : null;
    }
    reconstruct(row) {
        const entity = new this.target();
        for (const [key, value] of Object.entries(row)) {
            if (key.includes('.')) {
                const parts = key.split('.');
                let current = entity;
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    // Se o campo já existe e é uma string (provavelmente o ID da FK),
                    // precisamos transformá-lo em um objeto para aceitar as propriedades da relação.
                    if (typeof current[part] === 'string' || current[part] === undefined || current[part] === null) {
                        const id = typeof current[part] === 'string' ? current[part] : undefined;
                        current[part] = id ? { id } : {};
                    }
                    current = current[part];
                }
                current[parts[parts.length - 1]] = value;
            }
            else {
                // Se o valor for nulo e já existir um objeto (vindo de um campo aninhado), não sobrescrevemos.
                if (value === null && typeof entity[key] === 'object' && entity[key] !== null) {
                    continue;
                }
                entity[key] = value;
            }
        }
        return entity;
    }
    async executeHooks(type, entity) {
        const hooks = MetadataStore.getHooks(this.target).filter((h) => {
            return h.type === type;
        });
        for (const hook of hooks) {
            const method = entity[hook.propertyKey];
            if (typeof method === 'function') {
                await method.apply(entity);
            }
        }
    }
    async insert(data) {
        const entity = Object.assign(new this.target(), data);
        // Execute hooks
        await this.executeHooks('before-insert', entity);
        const persistableFields = MetadataStore.getPersistableFields(this.target);
        const now = new Date();
        for (const field of persistableFields) {
            if (field.createDate || field.updateDate) {
                if (entity[field.name] === undefined) {
                    entity[field.name] = now;
                }
            }
            if (field.generated && field.type === 'uuid' && entity[field.name] === undefined) {
                entity[field.name] = crypto.randomUUID();
            }
        }
        const persistableKeys = persistableFields.map((f) => {
            return f.name;
        });
        const keys = Object.keys(entity).filter((k) => {
            return persistableKeys.includes(k) || k === 'id';
        });
        const values = keys.map((k) => {
            return entity[k];
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
            const where = {};
            primaryFields.forEach((f) => {
                where[f.name] = entity[f.name];
            });
            return (await this.findOne({ where }));
        }
        else {
            const sql = `INSERT INTO ${driver.quoteIdentifier(this.metadata.tableName)} (${columns}) VALUES (${placeholders}) RETURNING *;`;
            const result = await driver.query(sql, values);
            return result[0];
        }
    }
    async update(where, data) {
        const entity = Object.assign(new this.target(), data);
        await this.executeHooks('before-update', entity);
        const persistableFields = MetadataStore.getPersistableFields(this.target);
        const now = new Date();
        for (const field of persistableFields) {
            if (field.updateDate) {
                entity[field.name] = now;
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
            return entity[k];
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
    async delete(where) {
        const driver = this.connection.getDriver();
        const { sql: whereSql, params } = this.translator.translateFilter(where);
        const sql = `DELETE FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
        await driver.query(sql, params);
    }
    async count(where) {
        const driver = this.connection.getDriver();
        const { sql: whereSql, params } = this.translator.translateFilter(where);
        const sql = `SELECT COUNT(*) as count FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
        const result = await driver.query(sql, params);
        return parseInt(result[0].count);
    }
    async exists(where) {
        const driver = this.connection.getDriver();
        const { sql: whereSql, params } = this.translator.translateFilter(where);
        const sql = `SELECT 1 FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql} LIMIT 1;`;
        const result = await driver.query(sql, params);
        return result.length > 0;
    }
    async aggregate(options) {
        const driver = this.connection.getDriver();
        const { sql: whereSql, params } = this.translator.translateFilter(options.where || {});
        const aggregateSql = this.translator.translateAggregate(options.aggregate);
        const sql = `SELECT ${aggregateSql} FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
        const result = await driver.query(sql, params);
        return result[0];
    }
    async distinct(options) {
        const driver = this.connection.getDriver();
        const { sql: whereSql, params } = this.translator.translateFilter(options.where || {});
        const sql = `SELECT DISTINCT ${driver.quoteIdentifier(options.field)} FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql};`;
        const result = await driver.query(sql, params);
        return result.map((r) => {
            return r[options.field];
        });
    }
    async group(options) {
        const driver = this.connection.getDriver();
        const { sql: whereSql, params } = this.translator.translateFilter(options.where || {});
        const groupSql = this.translator.translateGroup(options.by);
        let selectParts = [];
        if (options.select) {
            selectParts.push(this.translator.translateSelect(options.select));
        }
        else {
            selectParts.push(options.by
                .map((f) => {
                return driver.quoteIdentifier(f);
            })
                .join(', '));
        }
        if (options.aggregate) {
            selectParts.push(this.translator.translateAggregate(options.aggregate));
        }
        const sql = `SELECT ${selectParts.join(', ')} FROM ${driver.quoteIdentifier(this.metadata.tableName)} ${whereSql} ${groupSql};`;
        return await driver.query(sql, params);
    }
    validate(data) {
        const errors = {};
        for (const field of this.fields) {
            if (field.validation) {
                const val = field.validation();
                const fieldErrors = val.validate(data[field.name], data);
                if (fieldErrors && fieldErrors.length > 0) {
                    errors[field.name] = fieldErrors;
                }
            }
        }
        return errors;
    }
}
