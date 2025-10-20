import { DataSourceOptions } from "typeorm";

export interface OpposerSystemConfigOptions {
  jwt: string;
  database: DataSourceOptions;
}
