"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../helpers/index.js");
const index_js_2 = require("../../constants/index.js");
const Jwt = __importStar(require("../../security/jwt/index.js"));
const connect_js_1 = require("../../database/connect.js");
const urs_js_1 = __importDefault(require("../../security/schema/urs.js"));
exports.default = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.send((0, index_js_1.Exception)({ ...index_js_2.HttpStatus[403], message: "Unabled autorization key." }));
    }
    const request = req.body;
    const [_, token] = authorization.split(" ");
    const decoded = await Jwt.validate(token);
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
    var userRepository = connect_js_1.db.getRepository(urs_js_1.default);
    var currentUser = await userRepository.findOne({
        where: { id: decoded.usr },
        relations: ["rl"],
    });
    if (!currentUser) {
        return res.send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, not finded user.",
        }));
    }
    if (!currentUser.rl.some((x) => x.mt === request.method && x.sm === request.schema)) {
        return res.send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, verify our permissions and try again.",
        }));
    }
    return next();
};
