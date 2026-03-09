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
const get_js_1 = __importDefault(require("../services/get.js"));
const insert_js_1 = __importDefault(require("../services/insert.js"));
const update_js_1 = __importDefault(require("../services/update.js"));
const delete_js_1 = __importDefault(require("../services/delete.js"));
const index_js_1 = require("../constants/index.js");
const index_js_2 = __importDefault(require("../../system/index.js"));
const helper = __importStar(require("../handlers/index.js"));
const auth_js_1 = __importDefault(require("../security/handler/auth.js"));
const payload_js_1 = require("../decorators/payload.js");
const index_js_3 = require("../helpers/index.js");
const index_js_4 = __importDefault(require("../context/index.js"));
const settings = index_js_2.default.getSettingsFile();
exports.default = async (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            ...index_js_1.HttpStatus[400],
            message: 'Request body is empty or invalid. Please provide a valid JSON payload.',
        });
    }
    var props = req.body;
    //handler method call
    if (props.handler) {
        var { method, payload, handler } = props;
        if (!handler) {
            return res.status(400).json({
                ...index_js_1.HttpStatus[400],
                message: "Unable to identify handler name.",
            });
        }
        const customHandlers = index_js_4.default.get("handlers");
        var handlers = await helper.loadHandlers(customHandlers);
        if (settings.auth) {
            var auth = {
                methods: [
                    { name: "register" },
                    { name: "login" },
                    { name: "refresh" },
                    { name: "logout" },
                    { name: "me" },
                ],
                handler: auth_js_1.default,
                metadata: { name: "Auth" },
            };
            if (typeof settings.auth === "object" &&
                settings.auth.exposeChangePassword) {
                auth.methods.push(...[{ name: "changePassword" }, { name: "forgotPassword" }]);
            }
            Object.defineProperty(handlers, "Auth", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: auth,
            });
        }
        if (!handlers[handler]) {
            return res.status(400).json({
                ...index_js_1.HttpStatus[400],
                message: "Impossible to find handler.",
            });
        }
        if (!method) {
            return res.status(400).json({
                ...index_js_1.HttpStatus[400],
                message: "Unable to identify method name.",
            });
        }
        var __meta = handlers[handler];
        if (!__meta.methods.find((x) => x.name === method)) {
            return res.status(400).json({
                ...index_js_1.HttpStatus[400],
                message: "Unable to find action method.",
            });
        }
        var allDto = (0, payload_js_1.getPayloadMetadata)(__meta.handler);
        //realize validation dto
        if (Array.isArray(allDto) && allDto.length > 0) {
            var payloadMetadata = allDto.find((x) => x.name === method);
            if (payloadMetadata) {
                var erros = (0, index_js_3.validateData)(payloadMetadata.dto, payload);
                if (Object.keys(erros).length > 0) {
                    res.status(400).json({
                        erros,
                        message: "Data not valid for method, verify erros and try again.",
                    });
                    return;
                }
            }
        }
        try {
            const data = payload;
            payload = {
                headers: {
                    accept: req.headers.accept,
                    autorization: req.headers.authorization,
                    contentType: req.headers["content-type"],
                    origin: req.headers.origin,
                    ip: req.ip,
                    referer: req.headers.referer,
                    userAgent: req.headers["user-agent"],
                    cookies: {
                        data: req.cookies,
                        set: (name, value, options) => {
                            res.cookie(name, value, options);
                        },
                        remove: (name, options) => {
                            res.clearCookie(name, options);
                        },
                    },
                },
                data,
            };
            var resultHandler = await new __meta.handler()[method](payload);
            return res.status(200).json(resultHandler);
        }
        catch (err) {
            const error = err;
            return res.status(400).json((0, index_js_3.Exception)({
                ...index_js_1.HttpStatus[400],
                message: error.message,
            }));
        }
    }
    //database request...
    const customModels = index_js_4.default.get("models");
    var allModels = await index_js_2.default.getAllModels(customModels);
    var model = allModels.find((x) => x.name.toLocaleLowerCase() === props.model.toLocaleLowerCase());
    if (!model) {
        res.status(400).json({
            name: index_js_1.HttpStatus[400].name,
            code: index_js_1.HttpStatus[400].code,
            message: "Unable to identify Schema.",
        });
        return;
    }
    var result = {
        success: false,
        error: {
            name: index_js_1.HttpStatus[400].name,
            code: index_js_1.HttpStatus[400].code,
            message: "Unable to identify Schema",
        },
    };
    if (!["get", "insert", "update", "delete"].includes(props.method)) {
        result.error.message = "It was not possible to identify the method used.";
    }
    if (["insert", "update"].includes(props.method)) {
        var erros = (0, index_js_3.validateData)(model.entity, props.data);
        if (Object.keys(erros).length > 0) {
            return res.status(400).json({
                erros,
                message: "Data not valid for method, verify erros and try again.",
            });
        }
    }
    switch (props.method) {
        case "get":
            var getBody = req.body;
            result = await (0, get_js_1.default)(getBody);
            break;
        case "insert":
            var insertBody = req.body;
            result = await (0, insert_js_1.default)(insertBody);
            break;
        case "update":
            var updateBody = req.body;
            result = await (0, update_js_1.default)(updateBody);
            break;
        case "delete":
            var deleteBody = req.body;
            result = await (0, delete_js_1.default)(deleteBody);
            break;
    }
    if (result.success) {
        res.status(index_js_1.HttpStatus[200].code).json(result.data);
        return;
    }
    res.status(result.error.code).json(result.error);
    return;
};
