import { HttpStatus } from "../constants/index.js";
import { Exception, Success } from "../helpers/index.js";
import { HandleDeleteProps } from "../interfaces/controller.js";
import * as system from "../system/index.js";
import { db } from "../database/index.js";

export default async (props: HandleDeleteProps) => {
  var schema = (await system.getAllSchemas()).find(
    (x) => x.entity.name === props.schema
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

    await repository.delete(props.filter);

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
