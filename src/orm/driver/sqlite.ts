import { DatabaseDriver, ConnectionOptions } from "../opposer.js";
import { EntityMetadata, FieldMetadata } from "../metadata.js";

export class SQLiteDriver implements DatabaseDriver {
  private db: any;

  constructor(private options: ConnectionOptions) {}

  async connect() {
    const sqlite3 = (await import("sqlite3")).default;
    return new Promise<void>((resolve, reject) => {
      this.db = new sqlite3.Database(this.options.database, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async disconnect() {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const adjustedSql = sql.replace(/\$(\d+)/g, "?");
      this.db.all(adjustedSql, params, (err: any, rows: any) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async createTable(entity: EntityMetadata, fields: FieldMetadata[]): Promise<void> {
    const columnsSql = fields
      .filter((field) => {
        if (field.type === "relation") {
          return field.relation?.type !== "one-to-many" && field.relation?.type !== "many-to-many";
        }
        return true;
      })
      .map((field) => {
        let sqlType = this.getSqlType(field);
        let constraints = "";
        if (field.primary) constraints += " PRIMARY KEY";
        if (field.generated && field.type === "number") constraints += " AUTOINCREMENT";
        if (!field.nullable && !field.primary) constraints += " NOT NULL";
        if (field.default !== undefined) constraints += ` DEFAULT ${this.formatDefault(field.default)}`;

        return `"${field.name}" ${sqlType}${constraints}`;
      })
      .join(", ");

    const sql = `CREATE TABLE IF NOT EXISTS "${entity.tableName}" (${columnsSql});`;
    await this.query(sql);
  }

  private getSqlType(field: FieldMetadata): string {
    switch (field.type) {
      case "string": return "TEXT";
      case "number": return "INTEGER";
      case "boolean": return "INTEGER";
      case "date": return "DATETIME";
      case "jsonb": return "TEXT";
      case "uuid": return "TEXT";
      default: return "TEXT";
    }
  }

  private formatDefault(value: any): string {
    if (typeof value === "string") return `'${value}'`;
    if (value instanceof Date) return `'${value.toISOString()}'`;
    return String(value);
  }
}
