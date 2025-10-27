import { Request, Response } from "express";
import _get from "../services/get.js";
import _insert from "../services/insert.js";
import _update from "../services/update.js";
import _delete from "../services/delete.js";
import { HandleRequestResult } from "../../interfaces/request.js";
import {
  ControllerApiProps,
  HandleDeleteProps,
  HandleGetProps,
  HandleInsertProps,
  HandleUpdateProps,
} from "../../interfaces/controller.js";
import { HttpStatus } from "../constants/index.js";
import * as system from "../../system/index.js";
import { Field } from "../database/field.js";
import * as helper from "../handlers/index.js";
import Auth from "../security/handler/auth.js";
const settings = system.getSettingsFile();

export default async (req: Request, res: Response) => {
  var props = req.body as ControllerApiProps;

  //handler method call
  if (props.handler) {
    var { method, payload, handler } = props;

    if (!handler) {
      return res.status(400).json({
        ...HttpStatus[400],
        message: "Unable to identify handler name.",
      });
    }

    var handlers = await helper.loadHandlers();
    if (settings.auth) {
      var auth = {
        methods: [
          { name: "register" },
          { name: "login" },
          { name: "refresh" },
          { name: "logout" },
          { name: "me" },
        ],
        handler: Auth,
        metadata: { name: "auth" },
      };

      if (
        typeof settings.auth === "object" &&
        settings.auth.exposeChangePassword
      ) {
        auth.methods.push(
          ...[{ name: "change-password" }, { name: "forgot-password" }]
        );
      }

      handlers["auth"] = auth;
    }

    if (!handlers[handler]) {
      return res.status(400).json({
        ...HttpStatus[400],
        message: "Impossible to find handler.",
      });
    }

    if (!method) {
      return res.status(400).json({
        ...HttpStatus[400],
        message: "Unable to identify method name.",
      });
    }

    var __meta = handlers[handler];
    if (!__meta.methods.find((x: any) => x.name === method)) {
      return res.status(400).json({
        ...HttpStatus[400],
        message: "Unable to find action method.",
      });
    }

    var result = await new __meta.handler()[helper.toCamelCase(method)](
      payload
    );

    return res.status(200).json(result);
  }

  //database request...
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

  var erros = Field.validate(schema, props);
  if (Object.keys(erros).length > 0) {
    res.status(400).json({
      erros,
      message: "Data not valid for method, verify erros and try again.",
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
