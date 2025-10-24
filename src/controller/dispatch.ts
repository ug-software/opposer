import { Request, Response } from "express";
import * as handler from "../handlers/index.js";
import { HttpStatus } from "../constants/index.js";
import { RequestHandlerBody } from "../interfaces/handlers.js";
import * as system from "../system/index.js";
import Auth from "../security/handler/auth.js";
const settings = system.getSettingsFile();

export default async (req: Request, res: Response) => {
  var handlerName = req.params.handler;
  var { action, paylod } = req.body as RequestHandlerBody;

  if (!handlerName) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Unable to identify handler name.",
    });
  }

  var handlers = await handler.loadHandlers();
  var auth = {
    actions: [
      { name: "register" },
      { name: "login" },
      { name: "refresh" },
      { name: "logout" },
      { name: "me" },
      { name: "me" },
    ],
    handler: Auth,
    metadata: { name: "auth" },
  };

  if (typeof settings.auth === "object" && settings.auth.exposeChangePassword) {
    auth.actions.push(
      ...[{ name: "change-password" }, { name: "forgot-password" }]
    );
  }

  if (settings.auth) {
    handlers["auth"] = auth;
  }

  if (!handlers[handlerName]) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Impossible to find handler.",
    });
  }

  if (!action) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Unable to identify action name.",
    });
  }

  var __handler = handlers[handlerName];
  if (!__handler.actions.find((x) => x.name === action)) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Unable to find action method.",
    });
  }

  var result = await new __handler.handler()[handler.toCamelCase(action)](
    paylod
  );

  return res.status(200).json(result);
};
