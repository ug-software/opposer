import { Request, Response } from "express";
import * as reducer from "../reducers/index.js";
import { HttpStatus } from "../constants/index.js";
import { RequestReducerBody } from "../interfaces/reducers.js";

export default async (req: Request, res: Response) => {
  var reducerName = req.params.reducer;
  var { action, paylod } = req.body as RequestReducerBody;

  if (!reducerName) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Unable to identify reducer name.",
    });
  }

  var reducers = await reducer.loadReducers();
  if (!reducers[reducerName]) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Impossible to find reducer.",
    });
  }

  if (!action) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Unable to identify action name.",
    });
  }

  var __reducer = reducers[reducerName];
  if (!__reducer.actions.find((x) => x.name === action)) {
    return res.status(400).json({
      ...HttpStatus[400],
      message: "Unable to find action method.",
    });
  }

  var result = await new __reducer.handler()[reducer.toCamelCase(action)](
    paylod
  );

  return res.status(200).json(result);
};
