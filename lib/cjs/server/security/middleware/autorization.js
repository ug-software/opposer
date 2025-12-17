"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../helpers/index.js");
const index_js_2 = require("../../constants/index.js");
const connect_js_1 = require("../../database/connect.js");
const ke_js_1 = __importDefault(require("../schema/ke.js"));
exports.default = async (req, res, next) => {
    var api = req.headers["opposer-key"];
    if (!api) {
        return res.status(index_js_2.HttpStatus[401].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[401],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    if (!connect_js_1.db) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[database] - Don't finded database conection.",
        }));
    }
    var keRepository = connect_js_1.db.getRepository(ke_js_1.default);
    var authorization = await keRepository.findOne({ where: { hs: api } });
    if (!authorization) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    if (new Date() > new Date(authorization.ex)) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Unatorazed in system.",
        }));
    }
    next();
};
