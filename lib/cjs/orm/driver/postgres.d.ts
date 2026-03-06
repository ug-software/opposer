import { DatabaseDriver, ConnectionOptions } from "../opposer.js";
import { EntityMetadata, FieldMetadata } from "../metadata.js";
export declare class PostgresDriver implements DatabaseDriver {
    private options;
    private pool;
    constructor(options: ConnectionOptions);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query<T = any>(sql: string, params?: any[]): Promise<T[]>;
    quoteIdentifier(identifier: string): string;
    createTable(entity: EntityMetadata, fields: FieldMetadata[]): Promise<void>;
    private getSqlType;
    private formatDefault;
}
