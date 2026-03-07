"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../helpers/index.js");
const index_js_2 = require("../../constants/index.js");
const ke_js_1 = __importDefault(require("../models/ke.js"));
exports.default = async (req, res, next) => {
    const host = req.headers.host;
    const referer = req.headers.referer;
    // Bypass for playground or same domain requests
    if (referer && host && referer.includes(host)) {
        return next();
    }
    var api = (req.headers["opposer-key"] || req.cookies.opposer_key);
    if (!api) {
        return res.status(index_js_2.HttpStatus[401].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[401],
            message: "[autorization] - Unauthorized in system.",
        }));
    }
    const db = req.server.getContext("db");
    if (!db) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[database] - Database connection not found.",
        }));
    }
    var keRepository = db.getRepository(ke_js_1.default);
    var authorization = await keRepository.findOne({ where: { hs: api } });
    if (!authorization) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Unauthorized in system.",
        }));
    }
    if (new Date() > new Date(authorization.ex)) {
        return res.status(index_js_2.HttpStatus[403].code).send((0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[403],
            message: "[autorization] - Unauthorized in system.",
        }));
    }
    next();
};
