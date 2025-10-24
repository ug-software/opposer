import { DataSourceOptions } from "typeorm";
export interface OpposerSystemConfigOptions {
    jwt: string;
    database: DataSourceOptions;
}
export interface ClassType<T> {
    new (...args: any[]): T;
}
