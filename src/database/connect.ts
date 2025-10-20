import { DataSource, DataSourceOptions } from "typeorm";
import * as system from "../system/index.js";

var db: null | DataSource = null;

export { db };
export default async function (props: DataSourceOptions) {
  var entities = (await system.getAllSchemas()).map((x) => x.entity);
  var databaseConnection = new DataSource({
    ...props,
    entities,
  });

  //repassa como instancia unica, reutilizando a mesma conexão com o banco...
  db = databaseConnection;

  return await databaseConnection.initialize();
}
