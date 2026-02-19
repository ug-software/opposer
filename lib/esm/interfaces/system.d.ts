import { DataSourceOptions } from "typeorm";
export interface OpposerSystemConfigOptions {
    models: string;
    handlers: string;
    port: number;
    url?: string;
    text?: boolean;
    urlencoded?: boolean;
    helmet?: boolean;
    logger?: boolean;
    rateLimit?: {
        windowMs: number;
        max: number;
    };
    auth: boolean | {
        exposeChangePassword: boolean;
    };
    jwt: {
        access: string;
        refresh: string;
        recover: string;
    };
    database: DataSourceOptions;
    manager: {
        firstName: string;
        lastName: string;
        login: string;
        password: string;
    };
}
export interface ClassType<T> {
    new (...args: any[]): T;
}
