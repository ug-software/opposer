import { HandleGetProps } from "../../interfaces/controller.js";
import { Exception, Success } from "../helpers/index.js";
import { HttpStatus } from "../constants/index.js";
import system from "../../system/index.js";
import { HandleRequestResult } from "../../interfaces/request.js";
import opposerServer from "../core/index.js";
import { OpposerDatabase } from "../../orm/index.js";

export default async (
  props: HandleGetProps
): Promise<HandleRequestResult<unknown>> => {
  const allModels = await system.getAllModels();
  const schema = allModels.find(
    (x) => x.name.toLowerCase() === props.model.toLowerCase()
  );

  if (!schema) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Unable to identify Schema.",
    });
  }

  const db = opposerServer.getContext<OpposerDatabase>("db");

  if (!db) {
    return Exception({
      name: HttpStatus[500].name,
      code: HttpStatus[500].code,
      message: "Database not connected.",
    });
  }

  if (!props.query) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Search parameters missing.",
    });
  }

  const repository = db.getRepository(schema.entity);

  if (props.query.type === "filter") {
    const filter = props.query.filter || {};
    const select = props.query.select || [];
    const pagination = props.pagination;

    const items = await repository.find({
      where: filter,
      select,
      pagination,
    });

    if (props.pagination) {
      const totalItems = await repository.count(filter);
      const totalPages = Math.ceil(totalItems / (props.pagination.take || 10));

      return Success({
        items,
        totalItems,
        totalPages: totalPages > 0 ? totalPages : 0,
      });
    }

    return Success(items);
  }

  if (props.query.type === "find") {
    const find = props.query.find || {};
    const select = props.query.select || [];

    const result = await repository.findOne({
      where: find,
      select,
    });

    return Success(result);
  }

  return Exception({
    name: HttpStatus[400].name,
    code: HttpStatus[400].code,
    message: "Search type not understood (filter/find required).",
  });
};
