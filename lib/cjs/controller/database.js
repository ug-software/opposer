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
const system = __importStar(require("../system/index.js"));
const field_js_1 = require("../database/field.js");
exports.default = async (req, res) => {
    var props = req.body;
    var schema = (await system.getAllSchemas()).find((x) => x.name === props.schema);
    if (!schema) {
        res.status(400).json({
            name: index_js_1.HttpStatus[400].name,
            code: index_js_1.HttpStatus[400].code,
            message: "Unable to identify Schema.",
        });
        return;
    }
    var erros = field_js_1.Field.validate(schema, props);
    if (Object.keys(erros).length > 0) {
        res.status(400).json({
            erros,
            message: "Data not valid for method, verify erros and try again.",
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
    if (!["get", "insert", "update", "delete"].includes(req.body.method)) {
        result.error.message = "It was not possible to identify the method used.";
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
    //@ts-ignore
    res.status(result.error.code).json(result.error);
    return;
};
