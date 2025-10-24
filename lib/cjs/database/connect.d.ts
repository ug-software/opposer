import { DataSource, DataSourceOptions } from "typeorm";
declare var db: DataSource;
export { db };
export default function (props: DataSourceOptions): Promise<DataSource>;
