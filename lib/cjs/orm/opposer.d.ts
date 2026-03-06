import { EntityMetadata, FieldMetadata } from "./metadata.js";
import { Repository } from "./repository.js";
export interface DatabaseDriver {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query<T = any>(sql: string, params?: any[]): Promise<T[]>;
    createTable(entity: EntityMetadata, fields: FieldMetadata[]): Promise<void>;
    quoteIdentifier(identifier: string): string;
}
export interface ConnectionOptions {
    type: "postgres" | "sqlite" | "mysql";
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database: string;
    logging?: boolean;
}
export declare class OpposerDatabase {
    private driver;
    private entities;
    constructor(driver: DatabaseDriver, entities: Function[]);
    connect(): Promise<void>;
    getDriver(): DatabaseDriver;
    getEntities(): Function[];
    getRepository<T>(target: new (...args: any[]) => T): Repository<T>;
}
