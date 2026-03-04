import { DatabaseDriver, ConnectionOptions } from "../opposer.js";
import { EntityMetadata, FieldMetadata } from "../metadata.js";

export class PostgresDriver implements DatabaseDriver {
  private pool: any;

  constructor(private options: ConnectionOptions) {}

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

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async createTable(entity: EntityMetadata, fields: FieldMetadata[]): Promise<void> {
    const columnsSql = fields
      .map((field) => {
        let sqlType = this.getSqlType(field);
        let constraints = "";
        if (field.primary) constraints += " PRIMARY KEY";
        if (field.generated && field.type === "uuid") constraints += " DEFAULT gen_random_uuid()";
        else if (field.generated && field.type === "number") sqlType = "SERIAL";
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
      case "string": return field.length ? `VARCHAR(${field.length})` : "TEXT";
      case "number": return "INT";
      case "boolean": return "BOOLEAN";
      case "date": return "TIMESTAMP";
      case "jsonb": return "JSONB";
      case "uuid": return "UUID";
      default: return "TEXT";
    }
  }

  private formatDefault(value: any): string {
    if (typeof value === "string") return `'${value}'`;
    if (value instanceof Date) return `'${value.toISOString()}'`;
    return String(value);
  }
}
