import { Request, Response, NextFunction } from "../../core/index.js";
import { Exception } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import { OpposerDatabase } from "../../../orm/index.js";
import ke from "../models/ke.js";

export default async (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host;
  const referer = req.headers.referer;

  // Bypass for playground or same domain requests
  if (referer && host && referer.includes(host)) {
    return next();
  }

  var api = (req.headers["opposer-key"] || req.cookies.opposer_key) as string;

  if (!api) {
    return res.status(HttpStatus[401].code).send(
      Exception({
        ...HttpStatus[401],
        message: "[autorization] - Unauthorized in system.",
      })
    );
  }

  const db = (req as any).server.getContext("db") as OpposerDatabase;

  if (!db) {
    return res.status(HttpStatus[403].code).send(
      Exception({
        ...HttpStatus[403],
        message: "[database] - Database connection not found.",
      })
    );
  }

  var keRepository = db.getRepository(ke);
  var authorization = await keRepository.findOne({ where: { hs: api } });

  if (!authorization) {
    return res.status(HttpStatus[403].code).send(
      Exception({
        ...HttpStatus[403],
        message: "[autorization] - Unauthorized in system.",
      })
    );
  }

  if (new Date() > new Date(authorization.ex)) {
    return res.status(HttpStatus[403].code).send(
      Exception({
        ...HttpStatus[403],
        message: "[autorization] - Unauthorized in system.",
      })
    );
  }

  next();
};
