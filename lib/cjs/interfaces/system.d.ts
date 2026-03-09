import { ConnectionOptions } from "../orm/index.js";
export interface OpposerSystemConfigOptions {
    models: string;
    schedules: string;
    controllers: string;
    port: number;
    url?: string;
    text?: boolean;
    urlencoded?: boolean;
    helmet?: boolean;
    logger?: boolean;
    cors?: {
        origin: string | string[];
    };
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
    database: ConnectionOptions;
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
export interface ModelDefinition {
    name: string;
    entity: ClassType<unknown>;
}
