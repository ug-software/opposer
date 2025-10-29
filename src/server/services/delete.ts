import { HttpStatus } from "../constants/index.js";
import { Exception, Success } from "../helpers/index.js";
import { HandleDeleteProps } from "../../interfaces/controller.js";
import * as system from "../../system/index.js";
import { db } from "../database/index.js";
import QueryTool from "../tools/query.js";

export default async (props: HandleDeleteProps) => {
  var queryTool = new QueryTool();
  var schema = (await system.getAllModels()).find(
    (x) => x.name === props.model
  );

  if (!db) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Unable to connect for db.",
    });
  }

  if (schema) {
    var repository = db.getRepository(schema.entity);

    await repository.delete(queryTool.renderFilter(props.filter));

    return Success({
      message: "Success remove item",
    });
  }

  return Exception({
    name: HttpStatus[400].name,
    code: HttpStatus[400].code,
    message: "Unable to identify Schema.",
  });
};
