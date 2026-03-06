"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../helpers/index.js");
const index_js_2 = require("../../constants/index.js");
const index_js_3 = __importDefault(require("../jwt/index.js"));
const index_js_4 = __importDefault(require("../../../system/index.js"));
const index_js_5 = require("../../../server/decorators/index.js");
const se_js_1 = __importDefault(require("../models/se.js"));
exports.default = async (req, res, next) => {
    const host = req.headers.host;
    const referer = req.headers.referer;
    // Bypass for playground or same domain requests
    if (referer && host && referer.includes(host)) {
        return next();
    }
    const request = req.body;
    //skep session method
    if (["login", "register", "refresh"].includes(request.method)) {
        return next();
    }
    //skep for public models
    if (request.model) {
        var allModels = await index_js_4.default.getAllModels();
        var model = allModels.find((x) => x.name === request.model);
        if (model) {
            var isPublic = (0, index_js_5.getIsPublicMetadata)(model.entity);
            if (isPublic) {
                return next();
            }
        }
    }
    //skep for public methods
    if (request.handler) {
        const allHandlers = await index_js_4.default.getAllHandlers();
        var handler = allHandlers.find((x) => x.name.toUpperCase() === request.handler?.toUpperCase());
        if (handler) {
            var methods = (0, index_js_5.getIsPublicMethodMetadata)(handler);
            if (methods.some((x) => x.name === request.method)) {
                return next();
            }
        }
    }
    const db = req.server.getContext("db");
    var decoded = null;
    const authorization = req.headers.authorization || req.cookies.access_token;
    if (authorization) {
        var token = authorization.replace("Bearer ", "");
        decoded = await index_js_3.default.validate.access(token);
    }
    if (typeof decoded === "string" || !decoded || !authorization) {
        const refresh = req.cookies.refresh_token;
        if (!refresh) {
            return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
                ...index_js_2.HttpStatus[403],
                message: "[autorization] - Don't authorized, verify data and try again.",
            }));
        }
        if (!db) {
            return res.status(index_js_2.HttpStatus[500].code).send((0, index_js_1.Exception)({
                ...index_js_2.HttpStatus[500],
                message: "[database] - Database connection not found.",
            }));
        }
        var sessionRepository = db.getRepository(se_js_1.default);
        var last = await sessionRepository.findOne({
            where: { rt: refresh },
        });
        if (!last) {
            return res.status(index_js_2.HttpStatus[401].code).send((0, index_js_1.Exception)({
                ...index_js_2.HttpStatus[401],
                message: "Don't find session.",
            }));
        }
        //cancel last session and update in database;
        sessionRepository.update({ rt: last.rt }, {
            ac: false,
            lou: new Date(),
        });
        decoded = await index_js_3.default.validate.refresh(refresh);
        if (!decoded || typeof decoded === "string") {
            return res.status(index_js_2.HttpStatus[401].code).send((0, index_js_1.Exception)({
                ...index_js_2.HttpStatus[401],
                message: "Invalid refresh token.",
            }));
        }
        const { fn, id, lg, ln, rl } = decoded;
        var revalidate = await index_js_3.default.sign({ fn, id, lg, ln, rl });
        token = revalidate.token;
        const current = new Date();
        //seta os novos cookies
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(current.getTime() + 15 * 60 * 1000), // 15 mim
        });
        res.cookie("refresh_token", revalidate.refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(current.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 dias
        });
        await sessionRepository.insert({
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
            return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
                ...index_js_2.HttpStatus[403],
                message: "[autorization] - Don't authorized, verify our permissions and try again.",
            }));
        }
        return next();
    }
    return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
        ...index_js_2.HttpStatus[403],
        message: "Unabled authorization key.",
    }));
};
