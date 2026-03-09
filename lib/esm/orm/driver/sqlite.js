export class SQLiteDriver {
    constructor(options) {
        this.options = options;
    }
    async connect() {
        const sqlite3 = (await import("sqlite3")).default;
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.options.database, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async disconnect() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async query(sql, params) {
        if (this.options.logging) {
            console.log(`[SQL] ${sql}${params && params.length ? ` -- params: ${JSON.stringify(params)}` : ""}`);
        }
        return new Promise((resolve, reject) => {
            const adjustedSql = sql.replace(/\$(\d+)/g, "?");
            this.db.all(adjustedSql, params, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    quoteIdentifier(identifier) {
        return `"${identifier.replace(/"/g, '""')}"`;
    }
    async createTable(entity, fields) {
        const columnsSql = fields
            .filter((field) => {
            if (field.type === "relation") {
                return (field.relation?.type !== "one-to-many" &&
                    field.relation?.type !== "many-to-many");
            }
            return true;
        })
            .map((field) => {
            let sqlType = this.getSqlType(field);
            let constraints = "";
            if (field.primary) {
                constraints += " PRIMARY KEY";
            }
            if (field.generated && field.type === "number") {
                constraints += " AUTOINCREMENT";
            }
            if (field.nullable === false && !field.primary) {
                constraints += " NOT NULL";
            }
            if (field.default !== undefined) {
                constraints += ` DEFAULT ${this.formatDefault(field.default)}`;
            }
            return `${this.quoteIdentifier(field.name)} ${sqlType}${constraints}`;
        })
            .join(", ");
        const sql = `CREATE TABLE IF NOT EXISTS ${this.quoteIdentifier(entity.tableName)} (${columnsSql});`;
        await this.query(sql);
    }
    getSqlType(field) {
        switch (field.type) {
            case "string":
                return "TEXT";
            case "number":
                return "INTEGER";
            case "boolean":
                return "INTEGER";
            case "date":
                return "DATETIME";
            case "jsonb":
                return "TEXT";
            case "uuid":
                return "TEXT";
            default:
                return "TEXT";
        }
    }
    formatDefault(value) {
        if (typeof value === "string") {
            return `'${value.replace(/'/g, "''")}'`;
        }
        if (value instanceof Date) {
            return `'${value.toISOString()}'`;
        }
        return String(value);
    }
}
