import { OpposerDatabase } from './opposer.js';
import { EntityMetadata, FieldMetadata } from './metadata.js';
import { QueryBuilder as OpposerQueryBuilder, RelationBuilder } from '../interfaces/controller.js';
export declare class Repository<T> {
    private connection;
    private target;
    private metadata;
    private fields;
    private translator;
    constructor(connection: OpposerDatabase, target: Function);
    get Metadata(): EntityMetadata;
    get Fields(): FieldMetadata[];
    find(options: {
        where?: OpposerQueryBuilder;
        select?: string[];
        pagination?: {
            page: number;
            take: number;
        };
        relation?: (string | RelationBuilder)[];
    }): Promise<T[]>;
    findOne(options: {
        where?: OpposerQueryBuilder;
        select?: string[];
        relation?: (string | RelationBuilder)[];
    }): Promise<T | null>;
    private reconstruct;
    private executeHooks;
    insert(data: Partial<T>): Promise<T>;
    update(where: OpposerQueryBuilder, data: Partial<T>): Promise<void>;
    delete(where: OpposerQueryBuilder): Promise<void>;
    count(where: OpposerQueryBuilder): Promise<number>;
    exists(where: OpposerQueryBuilder): Promise<boolean>;
    aggregate(options: {
        where?: OpposerQueryBuilder;
        aggregate: {
            [key: string]: 'sum' | 'avg' | 'min' | 'max' | 'count';
        };
    }): Promise<any>;
    distinct(options: {
        where?: OpposerQueryBuilder;
        field: string;
    }): Promise<any[]>;
    group(options: {
        where?: OpposerQueryBuilder;
        by: string[];
        aggregate?: {
            [key: string]: 'sum' | 'avg' | 'min' | 'max' | 'count';
        };
        select?: string[];
    }): Promise<any[]>;
    validate(data: Partial<T>): Record<string, string[]>;
}
