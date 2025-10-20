//@ts-ignore
import * as jwt from "jsonwebtoken";
import { ErrorJwt, SignJwt } from "../../interfaces/jwt";
import * as System from "../../system";

const settings = System.getSettingsFile();

export async function validate(token: string) {
  try {
    const secret = process.env.PRIVATE_KEY
      ? process.env.PRIVATE_KEY
      : settings.jwt;
    const user = jwt.verify(token, secret) as SignJwt;

    return {
      usr: user.usr,
      uuid: user.uuid,
    };
  } catch (err) {
    var erro = err as ErrorJwt;
    if (erro.name === "TokenExpiredError") {
      return erro.message;
    }

    if (erro.name === "JsonWebTokenError") {
      return "Check your data and try again.";
    }
  }
}

export async function sign({ usr, uuid }: SignJwt) {
  const secret: string | null = null;

  if (!secret) {
    throw new Error(
      "[jwt] - Don't finded token secret, generate running 'npx opposer jwt generate' or consulting documentation."
    );
  }

  const token = jwt.sign({ usr, uuid }, secret, { expiresIn: "10h" });
  return token;
}

export async function verify(token: string) {
  try {
    const secret = process.env.PRIVATE_KEY
      ? process.env.PRIVATE_KEY
      : settings.jwt;
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    var erro = err as ErrorJwt;
    if (erro.name === "TokenExpiredError") {
      return erro.message;
    }

    if (erro.name === "JsonWebTokenError") {
      return "Check your data and try again";
    }
  }
}
