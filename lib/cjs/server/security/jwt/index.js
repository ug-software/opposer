"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = __importDefault(require("../../../system/index.js"));
const settings = index_js_1.default.getSettingsFile();
const accessJwt = process.env.ACCESS_JWT
    ? process.env.ACCESS_JWT
    : settings.jwt.access;
const refreshJwt = process.env.REFRESH_JWT
    ? process.env.REFRESH_JWT
    : settings.jwt.refresh;
const recoverJwt = process.env.RECOVER_JWT
    ? process.env.RECOVER_JWT
    : settings.jwt.recover;
async function access(token) {
    if (!accessJwt) {
        throw new Error("[jwt] - Don't finded token for access jwt, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, accessJwt);
        return user;
    }
    catch (err) {
        var erro = err;
        if (erro.name === "TokenExpiredError") {
            return erro.message;
        }
        if (erro.name === "JsonWebTokenError") {
            return "Check your data and try again.";
        }
    }
}
async function refresh(token) {
    if (!refreshJwt) {
        throw new Error("[jwt] - Don't finded token for refresh jwt, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, refreshJwt);
        return user;
    }
    catch (err) {
        var erro = err;
        if (erro.name === "TokenExpiredError") {
            return erro.message;
        }
        if (erro.name === "JsonWebTokenError") {
            return "Check your data and try again.";
        }
    }
}
async function sign({ exp, ...payload }) {
    if (!accessJwt) {
        throw new Error("[jwt] - Don't finded token secret, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    const token = jsonwebtoken_1.default.sign({ ...payload }, accessJwt, { expiresIn: "15m" });
    const refresh = jsonwebtoken_1.default.sign({ ...payload }, refreshJwt, {
        expiresIn: "15d",
    });
    return { token, refresh };
}
async function forget(payload) {
    if (!recoverJwt) {
        throw new Error("[jwt] - Don't finded token secret for recover password, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    const token = jsonwebtoken_1.default.sign(payload, accessJwt, { expiresIn: "5m" });
    return { token };
}
async function recover(token) {
    if (!recoverJwt) {
        throw new Error("[jwt] - Don't finded token secret for recover password, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, recoverJwt);
        return user;
    }
    catch (err) {
        var erro = err;
        if (erro.name === "TokenExpiredError") {
            return erro.message;
        }
        if (erro.name === "JsonWebTokenError") {
            return "Check your data and try again.";
        }
    }
}
async function verify(token) {
    try {
        const secret = process.env.ACCESS_JWT
            ? process.env.ACCESS_JWT
            : settings.jwt;
        jsonwebtoken_1.default.verify(token, secret);
        return true;
    }
    catch (err) {
        var erro = err;
        if (erro.name === "TokenExpiredError") {
            return erro.message;
        }
        if (erro.name === "JsonWebTokenError") {
            return "Check your data and try again.";
        }
    }
}
exports.default = { verify, sign, forget, validate: { access, refresh, recover } };
