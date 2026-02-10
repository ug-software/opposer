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
//@ts-ignore
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const System = __importStar(require("../../../system"));
const settings = System.getSettingsFile();
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
    const refresh = jsonwebtoken_1.default.sign({ id: payload.id }, refreshJwt, {
        expiresIn: "10d",
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
        throw new Error("[jwt] - Don't finded token for recover password, generate running 'npx opposer jwt generate' or consulting documentation.");
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
