import { QueryBuilder as OpposerQueryBuilder } from '../interfaces/controller.js';
import { EntityMetadata, FieldMetadata } from './metadata.js';
import { DatabaseDriver } from './opposer.js';
export declare class QueryTranslator {
    private entity;
    private fields;
    private driver;
    constructor(entity: EntityMetadata, fields: FieldMetadata[], driver: DatabaseDriver);
    private validateField;
    translateFilter(query: OpposerQueryBuilder): {
        sql: string;
        params: any[];
    };
    private renderFilter;
    private renderOperator;
    translateSelect(select: string[]): string;
    translateAggregate(aggregates: {
        [key: string]: 'sum' | 'avg' | 'min' | 'max' | 'count';
    }): string;
    translateGroup(fields: string[]): string;
    translatePagination(pagination: {
        page: number;
        take: number;
    } | undefined): string;
}
