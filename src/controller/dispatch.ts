import { Request, Response } from "express";
import * as handler from "../handlers/index.js";
import { HttpStatus } from "../constants/index.js";
import { RequestHandlerBody } from "../interfaces/handlers.js";

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
