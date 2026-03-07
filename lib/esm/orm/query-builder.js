export class QueryTranslator {
    constructor(entity, fields, driver) {
        this.entity = entity;
        this.fields = fields;
        this.driver = driver;
    }
    validateField(field) {
        return (this.fields.some((f) => {
            return f.name === field;
        }) ||
            field === 'id' ||
            field === '*');
    }
    translateFilter(query) {
        const params = [];
        const sql = this.renderFilter(query, params);
        return { sql: sql ? `WHERE ${sql}` : '', params };
    }
    renderFilter(query, params) {
        if (!query || typeof query !== 'object') {
            return '';
        }
        const parts = [];
        for (const [key, value] of Object.entries(query)) {
            if (key === '$or' && Array.isArray(value)) {
                const orParts = value
                    .map((v) => {
                    return this.renderFilter(v, params);
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
            if (!this.validateField(key)) {
                continue;
            }
            if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
                for (const [op, val] of Object.entries(value)) {
                    const operatorSql = this.renderOperator(key, op, val, params);
                    if (operatorSql) {
                        parts.push(operatorSql);
                    }
                }
            }
            else {
                params.push(value);
                parts.push(`${this.driver.quoteIdentifier(key)} = $${params.length}`);
            }
        }
        return parts.join(' AND ');
    }
    renderOperator(column, op, val, params) {
        const quotedColumn = this.driver.quoteIdentifier(column);
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
    translateSelect(select) {
        if (!select || select.length === 0) {
            return '*';
        }
        return select
            .filter((s) => {
            return this.validateField(s);
        })
            .map((s) => {
            return this.driver.quoteIdentifier(s);
        })
            .join(', ');
    }
    translateAggregate(aggregates) {
        return Object.entries(aggregates)
            .map(([field, op]) => {
            const quotedField = field === '*' ? '*' : this.driver.quoteIdentifier(field);
            const alias = this.driver.quoteIdentifier(`${op}_${field.replace('*', 'all')}`);
            return `${op.toUpperCase()}(${quotedField}) as ${alias}`;
        })
            .join(', ');
    }
    translateGroup(fields) {
        if (!fields || fields.length === 0) {
            return '';
        }
        const quotedFields = fields
            .filter((f) => {
            return this.validateField(f);
        })
            .map((f) => {
            return this.driver.quoteIdentifier(f);
        })
            .join(', ');
        return quotedFields ? `GROUP BY ${quotedFields}` : '';
    }
    translatePagination(pagination) {
        if (!pagination) {
            return '';
        }
        const limit = Math.max(0, pagination.take || 10);
        const offset = Math.max(0, pagination.page || 0) * limit;
        return `LIMIT ${limit} OFFSET ${offset}`;
    }
}
