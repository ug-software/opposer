import { Request, Response, NextFunction } from "express";
import { Exception } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import jwt from "../jwt/index.js";
import { db } from "../../database/connect.js";
import usr from "../schema/usr.js";
import { ControllerApiProps } from "../../../interfaces/controller.js";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.send(
      Exception({ ...HttpStatus[403], message: "Unabled autorization key." })
    );
  }

  const request = req.body as ControllerApiProps;
  const [_, token] = authorization.split(" ");
  const decoded = await jwt.validate.access(token);

  if (typeof decoded === "string" || !decoded) {
    return res.send(
      Exception({
        ...HttpStatus[403],
        message: "[autorization] - Don't autorized, verify data and try again.",
      })
    );
  }

  if (!db) {
    return res.send(
      Exception({
        ...HttpStatus[403],
        message: "[system] - Don't finded database conection.",
      })
    );
  }

  var userRepository = db.getRepository(usr);
  var currentUser = await userRepository.findOne({
    where: { id: decoded.id },
    relations: ["rl"],
  });

  if (!currentUser) {
    return res.send(
      Exception({
        ...HttpStatus[403],
        message: "[autorization] - Don't autorized, not finded user.",
      })
    );
  }

  if (
    !currentUser.rl.some(
      (x) => x.mt === request.method && x.sm === request.schema
    )
  ) {
    return res.send(
      Exception({
        ...HttpStatus[403],
        message:
          "[autorization] - Don't autorized, verify our permissions and try again.",
      })
    );
  }

  return next();
};
