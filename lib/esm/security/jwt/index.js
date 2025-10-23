//@ts-ignore
import * as jwt from "jsonwebtoken";
import * as System from "../../system";
const settings = System.getSettingsFile();
export async function validate(token) {
    try {
        const secret = process.env.PRIVATE_KEY
            ? process.env.PRIVATE_KEY
            : settings.jwt;
        const user = jwt.verify(token, secret);
        return {
            usr: user.usr,
            uuid: user.uuid,
        };
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
export async function sign({ usr, uuid }) {
    const secret = null;
    if (!secret) {
        throw new Error("[jwt] - Don't finded token secret, generate running 'npx opposer jwt generate' or consulting documentation.");
    }
    const token = jwt.sign({ usr, uuid }, secret, { expiresIn: "10h" });
    return token;
}
export async function verify(token) {
    try {
        const secret = process.env.PRIVATE_KEY
            ? process.env.PRIVATE_KEY
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
            return "Check your data and try again";
        }
    }
}
