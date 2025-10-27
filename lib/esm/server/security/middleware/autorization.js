import { Exception } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import { db } from "../../database/connect.js";
import ke from "../schema/ke.js";
export default async (req, res, next) => {
    var api = req.headers["opposer-authorization"];
    if (!api) {
        return res.send(Exception({
            ...HttpStatus[401],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    if (!db) {
        return res.send(Exception({
            ...HttpStatus[403],
            message: "[database] - Don't finded database conection.",
        }));
    }
    var keRepository = db.getRepository(ke);
    var authorization = await keRepository.findOne({ where: { hs: api } });
    if (!authorization) {
        return res.send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    if (new Date() > new Date(authorization.ex)) {
        return res.send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    next();
};
