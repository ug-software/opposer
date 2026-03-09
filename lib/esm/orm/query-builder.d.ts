import { QueryBuilder as OpposerQueryBuilder, RelationBuilder } from '../interfaces/controller.js';
import { EntityMetadata, FieldMetadata } from './metadata.js';
import { DatabaseDriver } from './opposer.js';
export declare class QueryTranslator {
    private entity;
    private fields;
    private driver;
    constructor(entity: EntityMetadata, fields: FieldMetadata[], driver: DatabaseDriver);
    private validateField;
    private validateTargetField;
    private renderFilter;
    translateFilter(query: OpposerQueryBuilder): {
        sql: string;
        params: any[];
        joins: Set<string>;
    };
    private quoteField;
    private renderOperator;
    translateSelect(select: string[]): string;
    translateRelations(relations: (string | RelationBuilder)[]): {
        select: string[];
        joins: string[];
    };
    translateAggregate(aggregates: {
        [key: string]: 'sum' | 'avg' | 'min' | 'max' | 'count';
    }): string;
    translateGroup(fields: string[]): string;
    translatePagination(pagination: {
        page: number;
        take: number;
    } | undefined): string;
}
