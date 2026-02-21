import { Exception } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import { db } from "../../database/connect.js";
import ke from "../schema/ke.js";
export default async (req, res, next) => {
    var api = (req.headers["opposer-key"] || req.cookies.opposer_key);
    if (!api) {
        return res.status(HttpStatus[401].code).send(Exception({
            ...HttpStatus[401],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    if (!db) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[database] - Don't finded database conection.",
        }));
    }
    var keRepository = db.getRepository(ke);
    var authorization = await keRepository.findOne({ where: { hs: api } });
    if (!authorization) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    if (new Date() > new Date(authorization.ex)) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    next();
};
