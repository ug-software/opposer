"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../helpers/index.js");
const index_js_2 = require("../../constants/index.js");
const index_js_3 = __importDefault(require("../jwt/index.js"));
const connect_js_1 = require("../../database/connect.js");
const usr_js_1 = __importDefault(require("../schema/usr.js"));
exports.default = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.send((0, index_js_1.Exception)({ ...index_js_2.HttpStatus[403], message: "Unabled autorization key." }));
    }
    const request = req.body;
    //skep session method
    if (["login", "register"].includes(request.method)) {
        return next();
    }
    const [_, token] = authorization.split(" ");
    const decoded = await index_js_3.default.validate.access(token);
    if (typeof decoded === "string" || !decoded) {
        return res.send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, verify data and try again.",
        }));
    }
    if (!connect_js_1.db) {
        return res.send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[system] - Don't finded database conection.",
        }));
    }
    var userRepository = connect_js_1.db.getRepository(usr_js_1.default);
    var currentUser = await userRepository.findOne({
        where: { id: decoded.id },
        relations: ["rl"],
    });
    if (!currentUser) {
        return res.send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, not finded user.",
        }));
    }
    //manager permission
    if (currentUser.rl.some((x) => x.mt === "all" && x.sm === "all")) {
        return next();
    }
    //granular permission
    if (!currentUser.rl.some((x) => x.mt === request.method && x.sm === request.schema)) {
        return res.send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, verify our permissions and try again.",
        }));
    }
    return next();
};
