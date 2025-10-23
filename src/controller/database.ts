import { Request, Response } from "express";
import _get from "../services/get.js";
import _insert from "../services/insert.js";
import _update from "../services/update.js";
import _delete from "../services/delete.js";
import { HandleRequestResult } from "../interfaces/request.js";
import {
  ControllerApiProps,
  HandleDeleteProps,
  HandleGetProps,
  HandleInsertProps,
  HandleUpdateProps,
} from "../interfaces/controller.js";
import { HttpStatus } from "../constants/index.js";
import * as system from "../system/index.js";

export default async (req: Request, res: Response) => {
  var props = req.body as ControllerApiProps;

  var schema = (await system.getAllSchemas()).find(
    (x) => x.name === props.schema
  );
  if (!schema) {
    res.status(400).json({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Unable to identify Schema.",
    });
    return;
  }

  var result: HandleRequestResult<unknown> = {
    success: false,
    error: {
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Unable to identify Schema",
    },
  };

  if (!["get", "insert", "update", "delete"].includes(req.body.method)) {
    result.error.message = "It was not possible to identify the method used.";
  }

  switch (props.method) {
    case "get":
      var getBody = req.body as HandleGetProps;
      result = await _get(getBody);

      break;

    case "insert":
      var insertBody = req.body as HandleInsertProps;
      result = await _insert(insertBody);

      break;

    case "update":
      var updateBody = req.body as HandleUpdateProps;
      result = await _update(updateBody);

      break;

    case "delete":
      var deleteBody = req.body as HandleDeleteProps;
      result = await _delete(deleteBody);

      break;
  }

  if (result.success) {
    res.status(HttpStatus[200].code).json(result.data);
    return;
  }

  //@ts-ignore
  res.status(result.error.code).json(result.error);
  return;
};
