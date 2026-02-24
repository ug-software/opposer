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
const index_js_1 = require("../constants/index.js");
const index_js_2 = require("../helpers/index.js");
const system = __importStar(require("../../system/index.js"));
const index_js_3 = require("../database/index.js");
const query_js_1 = __importDefault(require("../tools/query.js"));
exports.default = async (props) => {
    var queryTool = new query_js_1.default();
    var schema = (await system.getAllModels()).find((x) => x.name === props.model);
    if (!index_js_3.db) {
        return (0, index_js_2.Exception)({
            name: index_js_1.HttpStatus[400].name,
            code: index_js_1.HttpStatus[400].code,
            message: "Unable to connect for db.",
        });
    }
    if (schema) {
        var repository = index_js_3.db.getRepository(schema.entity);
        const query = queryTool.renderFilter(props.filter);
        if (!query) {
            return (0, index_js_2.Exception)({
                ...index_js_1.HttpStatus[400],
                message: "necessary set query params for delete items.",
            });
        }
        await repository.delete(query);
        return (0, index_js_2.Success)({
            message: "Success remove item",
        });
    }
    return (0, index_js_2.Exception)({
        name: index_js_1.HttpStatus[400].name,
        code: index_js_1.HttpStatus[400].code,
        message: "Unable to identify Schema.",
    });
};
