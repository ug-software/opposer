import { Exception } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import jwt from "../jwt/index.js";
import { db } from "../../database/connect.js";
import * as system from "../../../system/index.js";
import { getIsPublicMetadata, getIsPublicMethodMetadata, } from "../../../server/decorators/index.js";
import Session from "../schema/se.js";
export default async (req, res, next) => {
    const request = req.body;
    //skep session method
    if (["login", "register", "refresh"].includes(request.method)) {
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
    const authorization = (req.headers.authorization ||
        req.cookies.token_access);
    if (!authorization) {
        return res
            .status(HttpStatus[403].code)
            .send(Exception({ ...HttpStatus[403], message: "Unabled autorization key." }));
    }
    var token = authorization.replace("Bearer ", "");
    var decoded = await jwt.validate.access(token);
    if (typeof decoded === "string" || !decoded) {
        const refresh = req.cookies.refresh_token;
        if (!refresh) {
            return res.status(HttpStatus[403].code).send(Exception({
                ...HttpStatus[403],
                message: "[autorization] - Don't autorized, verify data and try again.",
            }));
        }
        var sessionRepository = db.getRepository(Session);
        var last = await sessionRepository.findOne({
            where: { rt: refresh },
        });
        if (!last) {
            return Exception({
                ...HttpStatus[401],
                message: "Don't find session.",
            });
        }
        if (!last.ac) {
            return Exception({
                ...HttpStatus[401],
                message: "Refresh expired.",
            });
        }
        decoded = await jwt.validate.refresh(refresh);
        if (!decoded || typeof decoded === "string") {
            return Exception({
                ...HttpStatus[401],
                message: "Invalid token.",
            });
        }
        //cancel last session and update in database;
        sessionRepository.update({ rt: last.rt }, {
            ac: false,
            lou: new Date(),
        });
        var revalidate = await jwt.sign(decoded);
        token = revalidate.token;
        const current = new Date();
        //seta os novos cookies
        res.cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(current.getTime() + 15 * 60 * 1000), // 15 mim
        });
        res.cookie("refresh_token", revalidate.refresh, {
            httpOnly: true,
            expires: new Date(current.getTime() + 10 * 60 * 60 * 1000), // 10 horas
        });
        await sessionRepository.save({
            ac: true,
            ag: last.ag,
            ip: last.ip,
            loi: new Date(),
            rt: refresh,
            usr: decoded.id,
        });
    }
    if (typeof decoded !== "string" && decoded !== undefined) {
        //manager permission
        if (decoded.rl.some((x) => x.mt === "all" && x.sm === "all")) {
            return next();
        }
        //granular permission
        if (!decoded.rl.some((x) => x.mt === request.method && x.sm === request.model)) {
            return res.status(HttpStatus[403].code).send(Exception({
                ...HttpStatus[403],
                message: "[autorization] - Don't autorized, verify our permissions and try again.",
            }));
        }
        return next();
    }
    return res
        .status(HttpStatus[403].code)
        .send(Exception({ ...HttpStatus[403], message: "Unabled autorization key." }));
};
