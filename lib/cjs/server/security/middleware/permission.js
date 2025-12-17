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
const index_js_3 = __importDefault(require("../jwt/index.js"));
const connect_js_1 = require("../../database/connect.js");
const usr_js_1 = __importDefault(require("../schema/usr.js"));
const system = __importStar(require("../../../system/index.js"));
const index_js_4 = require("../../../server/decorators/index.js");
exports.default = async (req, res, next) => {
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
            var isPublic = (0, index_js_4.getIsPublicMetadata)(model.entity);
            if (isPublic) {
                return next();
            }
        }
    }
    //skep for public methods
    if (request.handler) {
        var allHandles = await system.getAllHandlers();
        var handler = allHandles.find((x) => x.name === request.handler);
        if (handler) {
            var methods = (0, index_js_4.getIsPublicMethodMetadata)(handler);
            if (methods.includes(request.method)) {
                return next();
            }
        }
    }
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res
            .status(index_js_2.HttpStatus[403].code)
            .send((0, index_js_1.Exception)({ ...index_js_2.HttpStatus[403], message: "Unabled autorization key." }));
    }
    const [_, token] = authorization.split(" ");
    const decoded = await index_js_3.default.validate.access(token);
    if (typeof decoded === "string" || !decoded) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, verify data and try again.",
        }));
    }
    if (!connect_js_1.db) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
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
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, not finded user.",
        }));
    }
    //manager permission
    if (currentUser.rl.some((x) => x.mt === "all" && x.sm === "all")) {
        return next();
    }
    //granular permission
    if (!currentUser.rl.some((x) => x.mt === request.method && x.sm === request.model)) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Don't autorized, verify our permissions and try again.",
        }));
    }
    return next();
};
