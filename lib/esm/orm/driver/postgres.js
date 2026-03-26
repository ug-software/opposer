export class PostgresDriver {
    constructor(options) {
        this.options = options;
    }
    async connect() {
        const pg = (await import("pg")).default;
        this.pool = new pg.Pool({
            host: this.options.host,
            port: this.options.port,
            user: this.options.username,
            password: this.options.password,
            database: this.options.database,
        });
        await this.pool.connect();
    }
    async disconnect() {
        await this.pool.end();
    }
    async query(sql, params) {
        if (this.options.logging) {
            console.log(`[SQL] ${sql}${params && params.length ? ` -- params: ${JSON.stringify(params)}` : ""}`);
        }
        const result = await this.pool.query(sql, params);
        return result.rows;
    }
    quoteIdentifier(identifier) {
        return `"${identifier.replace(/"/g, '""')}"`;
    }
    async createTable(entity, fields) {
        const columnsSql = fields
            .map((field) => {
            let sqlType = this.getSqlType(field);
            let constraints = "";
            if (field.primary)
                constraints += " PRIMARY KEY";
            if (field.generated && field.type === "uuid")
                constraints += " DEFAULT gen_random_uuid()";
            else if (field.generated && field.type === "number")
                sqlType = "SERIAL";
            if (!field.nullable && !field.primary)
                constraints += " NOT NULL";
            if (field.default !== undefined)
                constraints += ` DEFAULT ${this.formatDefault(field.default)}`;
            return `${this.quoteIdentifier(field.name)} ${sqlType}${constraints}`;
        })
            .join(", ");
        const sql = `CREATE TABLE IF NOT EXISTS ${this.quoteIdentifier(entity.tableName)} (${columnsSql});`;
        await this.query(sql);
    }
    getSqlType(field) {
        switch (field.type) {
            case "string": return field.length ? `VARCHAR(${field.length})` : "TEXT";
            case "number": return "INT";
            case "boolean": return "BOOLEAN";
            case "date": return "TIMESTAMP";
            case "jsonb": return "JSONB";
            case "uuid": return "UUID";
            default: return "TEXT";
        }
    }
    formatDefault(value) {
        if (typeof value === "string")
            return `'${value.replace(/'/g, "''")}'`;
        if (value instanceof Date)
            return `'${value.toISOString()}'`;
        return String(value);
    }
}
