import { QueryBuilder } from "typeorm";
import { HandleGetProps } from "../interfaces/controller.js";
import { Exception, Success } from "../helpers/index.js";
import { HttpStatus } from "../constants/index.js";
import * as system from "../system/index.js";
import { HandleRequestResult } from "../interfaces/request.js";
import { db } from "../database/index.js";

export default async (
  props: HandleGetProps
): Promise<HandleRequestResult<unknown>> => {
  var schema = (await system.getAllSchemas()).find(
    (x) => x.name === props.schema
  );
  if (!schema) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Unable to identify Schema.",
    });
  }

  if (!db) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Unable to connect for db.",
    });
  }

  var repository = db.getRepository(schema.entity);

  if (props.query.type === "filter") {
    //@ts-ignore
    var queryBuilder = {} as QueryBuilder;

    if (props.query.join) {
      var relations = props.query.join.map((x) => x.schema);
      queryBuilder.relations = relations;
    }

    if (props.pagination) {
      var skip = 0;
      if (!props.pagination.take || props.pagination.take === 0) {
        props.pagination.take = 10;
      }

      if (props.pagination.page) {
        skip = props.pagination.page * props.pagination.take;
      }

      queryBuilder = {
        take: props.pagination.take,
        skip,
      };
    }

    if (!props.query.filter) {
      return Exception({
        name: HttpStatus[400].name,
        code: HttpStatus[400].code,
        message: "Search not understood, missing 'filter' parameter",
      });
    }

    if (props.query.select) {
      queryBuilder.select = props.query.select;
    }

    var resultFilter = await repository.find({
      where: props.query.filter,
      ...queryBuilder,
    });

    if (props.pagination) {
      var totalItems = await repository.count({
        where: props.query.filter,
        ...queryBuilder,
      });
      var totalPages = Math.floor(totalItems / props.pagination.take);

      return Success({
        items: resultFilter,
        totalItems,
        totalPages: totalPages > 0 ? totalPages : 0,
      });
    }

    return Success(resultFilter);
  }

  if (props.query.type === "find") {
    //@ts-ignore
    var queryBuilder = {} as QueryBuilder;

    if (props.query.join) {
      var relations = props.query.join.map((x) => x.schema);
      queryBuilder.relations = relations;
    }

    if (!props.query.find) {
      return Exception({
        name: HttpStatus[400].name,
        code: HttpStatus[400].code,
        message: "Search not understood, missing 'find' parameter.",
      });
    }

    if (props.query.select) {
      queryBuilder.select = props.query.select;
    }

    var resultFind = await repository.findOne({
      where: props.query.find,
      ...queryBuilder,
    });

    return Success(resultFind);
  }

  return Exception({
    name: HttpStatus[400].name,
    code: HttpStatus[400].code,
    message: "Search not understood",
  });
};
