//@ts-ignore
import jwt from "jsonwebtoken";
import system from "../../../system/index.js";
const settings = system.getSettingsFile();
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
        const user = jwt.verify(token, accessJwt);
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
        const user = jwt.verify(token, refreshJwt);
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
    const token = jwt.sign({ ...payload }, accessJwt, { expiresIn: "15m" });
    const refresh = jwt.sign({ ...payload }, refreshJwt, {
        expiresIn: "15d",
    });
    return { token, refresh };
}
async function forget(payload) {
    if (!recoverJwt) {
        throw new Error("[jwt] - Don't finded token secret for recover password, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    const token = jwt.sign(payload, accessJwt, { expiresIn: "5m" });
    return { token };
}
async function recover(token) {
    if (!recoverJwt) {
        throw new Error("[jwt] - Don't finded token secret for recover password, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    try {
        const user = jwt.verify(token, recoverJwt);
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
        jwt.verify(token, secret);
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
export default { verify, sign, forget, validate: { access, refresh, recover } };
