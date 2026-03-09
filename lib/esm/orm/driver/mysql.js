export class MySQLDriver {
    constructor(options) {
        this.options = options;
    }
    async connect() {
        const mysql = (await import("mysql2/promise")).default;
        this.connection = await mysql.createConnection({
            host: this.options.host,
            port: this.options.port,
            user: this.options.username,
            password: this.options.password,
            database: this.options.database,
        });
    }
    async disconnect() {
        await this.connection.end();
    }
    async query(sql, params) {
        if (this.options.logging) {
            console.log(`[SQL] ${sql}${params && params.length ? ` -- params: ${JSON.stringify(params)}` : ""}`);
        }
        const adjustedSql = sql.replace(/\$(\d+)/g, "?");
        const [rows] = await this.connection.execute(adjustedSql, params);
        return rows;
    }
    quoteIdentifier(identifier) {
        return `\`${identifier.replace(/`/g, "``")}\``;
    }
    async createTable(entity, fields) {
        const columnsSql = fields
            .map((field) => {
            let sqlType = this.getSqlType(field);
            let constraints = "";
            if (field.primary)
                constraints += " PRIMARY KEY";
            if (field.generated && field.type === "number")
                sqlType += " AUTO_INCREMENT";
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
            case "date": return "DATETIME";
            case "jsonb": return "JSON";
            case "uuid": return "VARCHAR(36)";
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
