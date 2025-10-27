import { DataSource, DataSourceOptions } from "typeorm";
import * as system from "../../system/index.js";

// false conection for not error...
var db = new DataSource({
  database: ":memory",
  type: "postgres",
  entities: [],
});

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
