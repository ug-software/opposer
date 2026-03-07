import { Exception } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import ke from "../models/ke.js";
export default async (req, res, next) => {
    const host = req.headers.host;
    const referer = req.headers.referer;
    // Bypass for playground or same domain requests
    if (referer && host && referer.includes(host)) {
        return next();
    }
    var api = (req.headers["opposer-key"] || req.cookies.opposer_key);
    if (!api) {
        return res.status(HttpStatus[401].code).send(Exception({
            ...HttpStatus[401],
            message: "[autorization] - Unauthorized in system.",
        }));
    }
    const db = req.server.getContext("db");
    if (!db) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[database] - Database connection not found.",
        }));
    }
    var keRepository = db.getRepository(ke);
    var authorization = await keRepository.findOne({ where: { hs: api } });
    if (!authorization) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Unauthorized in system.",
        }));
    }
    if (new Date() > new Date(authorization.ex)) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Unauthorized in system.",
        }));
    }
    next();
};
