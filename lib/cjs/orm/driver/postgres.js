"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDriver = void 0;
class PostgresDriver {
    constructor(options) {
        this.options = options;
    }
    async connect() {
        const pg = (await Promise.resolve().then(() => __importStar(require("pg")))).default;
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
exports.PostgresDriver = PostgresDriver;
