import { BaseEntity, FindOptionsSelect } from "typeorm";
import { ClassType } from "./system.js";
export interface ControllerApiProps {
    handler?: string;
    method: "get" | "insert" | "update" | "delete" | string;
    schema: string;
    payload?: any;
}
export interface QueryBuilder {
    [key: string]: any;
}
export interface HandleGetProps {
    schema: string;
    pagination: {
        page: number;
        take: number;
    } | undefined;
    query: {
        type: "find" | "filter" | "between";
        select: FindOptionsSelect<BaseEntity> | undefined;
        find: {
            [key: string]: unknown;
        };
        filter: {
            [key: string]: unknown;
        };
        between: {
            propertie: string;
            init: any;
            final: any;
        };
        join: [
            {
                schema: string;
                filter: {
                    [key: string]: unknown;
                };
            }
        ];
    };
}
export interface HandleDeleteProps {
    schema: string;
    filter: {
        [key: string]: unknown;
    };
}
export interface HandleInsertProps {
    schema: string;
    data: {
        [key: string]: unknown;
    };
}
export interface HandleUpdateProps {
    schema: string;
    filter: {
        [key: string]: unknown;
    };
    data: {
        [key: string]: unknown;
    };
}
export interface ResultGetAllHandlers {
    [key: string]: {
        metadata: {
            name: string;
        };
        methods: {
            name: string;
        }[];
        handler: ClassType<any>;
    };
}
