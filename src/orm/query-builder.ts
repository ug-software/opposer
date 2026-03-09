import { QueryBuilder as OpposerQueryBuilder, RelationBuilder } from '../interfaces/controller.js';
import { EntityMetadata, FieldMetadata, MetadataStore } from './metadata.js';
import { DatabaseDriver } from './opposer.js';

export class QueryTranslator {
  constructor(
    private entity: EntityMetadata,
    private fields: FieldMetadata[],
    private driver: DatabaseDriver,
  ) {}

  private validateField(field: string): boolean {
    if (field.includes('.')) {
      const [relationName, ...rest] = field.split('.');
      const relationField = this.fields.find((f) => f.name === relationName && f.type === 'relation');
      if (relationField && relationField.relation) {
        const targetEntity = relationField.relation.target();
        const targetFields = MetadataStore.getFields(targetEntity);
        const subField = rest.join('.');
        return this.validateTargetField(targetFields, subField);
      }
      return false;
    }

    return (
      this.fields.some((f) => {
        return f.name === field;
      }) ||
      field === 'id' ||
      field === '*'
    );
  }

  private validateTargetField(fields: FieldMetadata[], field: string): boolean {
    if (field.includes('.')) {
      const [relationName, ...rest] = field.split('.');
      const relationField = fields.find((f) => f.name === relationName && f.type === 'relation');
      if (relationField && relationField.relation) {
        const targetEntity = relationField.relation.target();
        const targetFields = MetadataStore.getFields(targetEntity);
        return this.validateTargetField(targetFields, rest.join('.'));
      }
      return false;
    }
    return fields.some((f) => f.name === field) || field === 'id' || field === '*';
  }

  private renderFilter(query: OpposerQueryBuilder, params: any[], joins: Set<string>, prefix: string = ''): string {
    if (!query || typeof query !== 'object') {
      return '';
    }

    const parts: string[] = [];

    for (const [key, value] of Object.entries(query)) {
      if (key === '$or' && Array.isArray(value)) {
        const orParts = value
          .map((v) => {
            return this.renderFilter(v, params, joins, prefix);
          })
          .filter((v) => {
            return v !== '';
          })
          .map((v) => {
            return `(${v})`;
          });
        if (orParts.length > 0) {
          parts.push(`(${orParts.join(' OR ')})`);
        }
        continue;
      }

      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (!this.validateField(fullPath)) {
        continue;
      }

      // If it's a nested object that is NOT an operator ($l, $eq, etc) and NOT a Date,
      // and it corresponds to a relation, we treat it as a nested filter.
      const isOperator = typeof key === 'string' && key.startsWith('$');
      const isNestedFilter = 
        typeof value === 'object' && 
        value !== null && 
        !(value instanceof Date) && 
        !Object.keys(value).some(k => k.startsWith('$'));

      if (isNestedFilter) {
        // It's a nested filter (e.g., { author: { name: "..." } })
        joins.add(key); // Ensure the join is added for this level
        const nestedFilter = this.renderFilter(value as OpposerQueryBuilder, params, joins, fullPath);
        if (nestedFilter) {
          parts.push(nestedFilter);
        }
        continue;
      }

      if (fullPath.includes('.')) {
        const [relationName] = fullPath.split('.');
        joins.add(relationName);
      }

      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        for (const [op, val] of Object.entries(value)) {
          const operatorSql = this.renderOperator(fullPath, op, val, params);
          if (operatorSql) {
            parts.push(operatorSql);
          }
        }
      } else {
        params.push(value);
        parts.push(`${this.quoteField(fullPath)} = $${params.length}`);
      }
    }

    return parts.join(' AND ');
  }

  translateFilter(query: OpposerQueryBuilder): { sql: string; params: any[]; joins: Set<string> } {
    const params: any[] = [];
    const joins = new Set<string>();
    const sql = this.renderFilter(query, params, joins);

    return { sql: sql ? `WHERE ${sql}` : '', params, joins };
  }

  private quoteField(field: string): string {
    if (field.includes('.')) {
      return field
        .split('.')
        .map((p) => this.driver.quoteIdentifier(p))
        .join('.');
    }
    return `${this.driver.quoteIdentifier(this.entity.tableName)}.${this.driver.quoteIdentifier(field)}`;
  }

  private renderOperator(column: string, op: string, val: any, params: any[]): string {
    const quotedColumn = this.quoteField(column);

    switch (op) {
      case '$l':
        params.push(val);
        return `${quotedColumn} LIKE $${params.length}`;
      case '$il':
        params.push(val);
        return `${quotedColumn} ILIKE $${params.length}`;
      case '$in':
      case '$nin': {
        if (!Array.isArray(val) || val.length === 0) {
          return '';
        }
        const placeholders = val
          .map((v) => {
            params.push(v);
            return `$${params.length}`;
          })
          .join(', ');
        const operator = op === '$in' ? 'IN' : 'NOT IN';
        return `${quotedColumn} ${operator} (${placeholders})`;
      }
      case '$btw':
        if (!Array.isArray(val) || val.length < 2) {
          return '';
        }
        params.push(val[0]);
        params.push(val[1]);
        return `${quotedColumn} BETWEEN $${params.length - 1} AND $${params.length}`;
      case '$mt':
        params.push(val);
        return `${quotedColumn} > $${params.length}`;
      case '$mte':
        params.push(val);
        return `${quotedColumn} >= $${params.length}`;
      case '$lt':
        params.push(val);
        return `${quotedColumn} < $${params.length}`;
      case '$lte':
        params.push(val);
        return `${quotedColumn} <= $${params.length}`;
      case '$eq':
        params.push(val);
        return `${quotedColumn} = $${params.length}`;
      default:
        return '';
    }
  }

  translateSelect(select: string[]): string {
    const table = this.driver.quoteIdentifier(this.entity.tableName);
    if (!select || select.length === 0) {
      return `${table}.*`;
    }
    return select
      .filter((s) => {
        return this.validateField(s);
      })
      .map((s) => {
        return this.quoteField(s);
      })
      .join(', ');
  }

  translateRelations(relations: (string | RelationBuilder)[]): { select: string[]; joins: string[] } {
    const select: string[] = [];
    const joins: string[] = [];

    for (const rel of relations) {
      const relationName = typeof rel === 'string' ? rel : rel.model;
      const relationField = this.fields.find((f) => f.name === relationName && f.type === 'relation');

      if (!relationField) {
        throw new Error(`Relation '${relationName}' not found on model '${this.entity.name}'`);
      }

      if (relationField.relation) {
        const targetEntity = relationField.relation.target();
        const targetMetadata = MetadataStore.getEntity(targetEntity);
        const targetFields = MetadataStore.getFields(targetEntity);

        if (targetMetadata) {
          const targetTable = this.driver.quoteIdentifier(targetMetadata.tableName);
          const relationAlias = this.driver.quoteIdentifier(relationName);
          const sourceTable = this.driver.quoteIdentifier(this.entity.tableName);

          // Determine join columns
          const targetPrimary = targetFields.find(f => f.primary);
          const targetPrimaryKeyName = targetPrimary ? targetPrimary.name : 'id';
          
          let joinCondition = '';
          if (relationField.relation.type === 'many-to-one' || (relationField.relation.type === 'one-to-one' && relationField.relation.joinColumn)) {
            joinCondition = `${sourceTable}.${this.driver.quoteIdentifier(relationName)} = ${relationAlias}.${this.driver.quoteIdentifier(targetPrimaryKeyName)}`;
          } else if (relationField.relation.type === 'one-to-many' || (relationField.relation.type === 'one-to-one' && !relationField.relation.joinColumn)) {
            const inverseSide = relationField.relation.inverseSide;
            if (inverseSide) {
              joinCondition = `${relationAlias}.${this.driver.quoteIdentifier(inverseSide)} = ${sourceTable}.id`;
            }
          }

          if (joinCondition) {
            joins.push(`LEFT JOIN ${targetTable} AS ${relationAlias} ON ${joinCondition}`);
            
            const selectedFields = typeof rel === 'object' && rel.select ? rel.select : ['*'];
            for (const f of selectedFields) {
              if (typeof f === 'string') {
                if (f === '*') {
                  for (const tf of targetFields) {
                    if (tf.type !== 'relation') {
                      select.push(`${relationAlias}.${this.driver.quoteIdentifier(tf.name)} AS ${this.driver.quoteIdentifier(`${relationName}.${tf.name}`)}`);
                    }
                  }
                  // Also include 'id' if not in targetFields
                  if (!targetFields.some(tf => tf.name === 'id')) {
                     select.push(`${relationAlias}.id AS ${this.driver.quoteIdentifier(`${relationName}.id`)}`);
                  }
                } else {
                  select.push(`${relationAlias}.${this.driver.quoteIdentifier(f)} AS ${this.driver.quoteIdentifier(`${relationName}.${f}`)}`);
                }
              }
              // TODO: nested relations
            }
          }
        }
      }
    }

    return { select, joins };
  }

  translateAggregate(aggregates: { [key: string]: 'sum' | 'avg' | 'min' | 'max' | 'count' }): string {
    return Object.entries(aggregates)
      .map(([field, op]) => {
        const quotedField = field === '*' ? '*' : this.quoteField(field);
        const alias = this.driver.quoteIdentifier(`${op}_${field.replace('*', 'all').replace('.', '_')}`);
        return `${op.toUpperCase()}(${quotedField}) as ${alias}`;
      })
      .join(', ');
  }

  translateGroup(fields: string[]): string {
    if (!fields || fields.length === 0) {
      return '';
    }
    const quotedFields = fields
      .filter((f) => {
        return this.validateField(f);
      })
      .map((f) => {
        return this.quoteField(f);
      })
      .join(', ');
    return quotedFields ? `GROUP BY ${quotedFields}` : '';
  }

  translatePagination(pagination: { page: number; take: number } | undefined): string {
    if (!pagination) {
      return '';
    }
    const limit = Math.max(0, pagination.take || 10);
    const offset = Math.max(0, pagination.page || 0) * limit;
    return `LIMIT ${limit} OFFSET ${offset}`;
  }
}

