import { ClassType } from './system.js';
export interface ControllerApiProps {
    controller?: string;
    method: 'get' | 'insert' | 'update' | 'delete' | string;
    model: string;
    payload?: any;
    data?: any;
}
export interface QueryBuilder {
    [key: string]: string | number | boolean | Date | {
        $or?: {
            [key: string]: any;
        }[];
        $l?: string;
        $il?: string;
        $in?: (string | number | Date)[];
        $nin?: (string | number | Date)[];
        $btw?: [number, number];
        $mt?: number | Date;
        $mte?: number | Date;
        $lt?: number | Date;
        $lte?: number | Date;
        $eq?: any;
    };
}
export interface RelationBuilder {
    model: string;
    select: (string | RelationBuilder)[];
}
export type AggregateOperator = 'sum' | 'avg' | 'min' | 'max' | 'count';
export interface HandleGetProps {
    model: string;
    pagination?: {
        page: number;
        take: number;
    };
    query: {
        type?: 'filter' | 'find' | 'count' | 'exists' | 'aggregate' | 'distinct' | 'group';
        select?: string[];
        find?: QueryBuilder;
        filter?: QueryBuilder;
        count?: QueryBuilder;
        exists?: QueryBuilder;
        aggregate?: {
            where?: QueryBuilder;
            aggregate: {
                [key: string]: AggregateOperator;
            };
        };
        distinct?: {
            where?: QueryBuilder;
            field: string;
        };
        group?: {
            where?: QueryBuilder;
            by: string[];
            aggregate?: {
                [key: string]: AggregateOperator;
            };
            select?: string[];
        };
        relation?: (string | RelationBuilder)[];
    };
}
export interface HandleDeleteProps {
    model: string;
    filter: QueryBuilder;
}
export interface HandleInsertProps {
    model: string;
    data: {
        [key: string]: unknown;
    };
}
export interface HandleUpdateProps {
    model: string;
    filter: QueryBuilder;
    data: {
        [key: string]: unknown;
    };
}
export interface ResultGetAllControllers {
    [key: string]: {
        metadata: {
            name: string;
        };
        methods: {
            name: string;
        }[];
        controller: ClassType<any>;
    };
}
export interface PayloadRequest<D> {
    data: D;
    headers: {
        autorization: string;
        contentType: string;
        accept: string;
        origin: string;
        referer: string;
        userAgent: string;
        ip: string;
        cookies: {
            data: Record<string, string>;
            set: (name: string, value: string, options: any) => void;
            remove: (name: string, options?: any) => void;
        };
    };
}
