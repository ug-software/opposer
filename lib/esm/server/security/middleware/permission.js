import { Exception } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import jwt from "../jwt/index.js";
import { db } from "../../database/connect.js";
import usr from "../schema/usr.js";
import * as system from "../../../system/index.js";
import { getIsPublicMetadata, getIsPublicMethodMetadata, } from "../../../server/decorators/index.js";
export default async (req, res, next) => {
    const request = req.body;
    //skep session method
    if (["login", "register"].includes(request.method)) {
        return next();
    }
    //skep for public models
    if (request.model) {
        var allModels = await system.getAllModels();
        var model = allModels.find((x) => x.name === request.model);
        if (model) {
            var isPublic = getIsPublicMetadata(model.entity);
            if (isPublic) {
                return next();
            }
        }
    }
    //skep for public methods
    if (request.handler) {
        var allHandles = await system.getAllHandlers();
        var handler = allHandles.find((x) => x.name.toUpperCase() === request.handler?.toUpperCase());
        if (handler) {
            var methods = getIsPublicMethodMetadata(handler);
            if (methods.some((x) => x.name === request.method)) {
                return next();
            }
        }
    }
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res
            .status(HttpStatus[403].code)
            .send(Exception({ ...HttpStatus[403], message: "Unabled autorization key." }));
    }
    const [_, token] = authorization.split(" ");
    const decoded = await jwt.validate.access(token);
    if (typeof decoded === "string" || !decoded) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Don't autorized, verify data and try again.",
        }));
    }
    if (!db) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[system] - Don't finded database conection.",
        }));
    }
    var userRepository = db.getRepository(usr);
    var currentUser = await userRepository.findOne({
        where: { id: decoded.id },
        relations: ["rl"],
    });
    if (!currentUser) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Don't autorized, not finded user.",
        }));
    }
    //manager permission
    if (currentUser.rl.some((x) => x.mt === "all" && x.sm === "all")) {
        return next();
    }
    //granular permission
    if (!currentUser.rl.some((x) => x.mt === request.method && x.sm === request.model)) {
        return res.status(HttpStatus[403].code).send(Exception({
            ...HttpStatus[403],
            message: "[autorization] - Don't autorized, verify our permissions and try again.",
        }));
    }
    return next();
};
