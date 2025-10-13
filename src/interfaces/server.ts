import { DataSourceOptions } from "typeorm";

export interface CreateServerProps {
  port: number;
  url?: string;
  text?: boolean;
  urlencoded?: boolean;
  helmet?: boolean;
  logger?: boolean;
  cors?: {
    origin: string;
  };
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  database: DataSourceOptions;
}
