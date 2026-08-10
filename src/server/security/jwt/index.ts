//@ts-ignore
import jwt from 'jsonwebtoken';
import { ErrorJwt, ForgetJwt, SignJwt } from '../../../interfaces/jwt.js';
import system from '../../../system/index.js';

const settings = system.getSettingsFile();
const accessJwt = process.env.OPPOSER_JWT_ACCESS || settings.jwt?.access;
const refreshJwt = process.env.OPPOSER_JWT_REFRESH || settings.jwt?.refresh;
const recoverJwt = process.env.OPPOSER_JWT_RECOVER || settings.jwt?.recover;

async function access(token: string) {
  if (!accessJwt) {
    throw new Error("[jwt] - Don't finded token for access jwt, generate running 'npx @ug.software/opposer jwt generate' or consulting documentation.");
  }

  try {
    const user = jwt.verify(token, accessJwt) as SignJwt;

    return user;
  } catch (err) {
    var erro = err as ErrorJwt;
    if (erro.name === 'TokenExpiredError') {
      return erro.message;
    }

    if (erro.name === 'JsonWebTokenError') {
      return 'Check your data and try again.';
    }
  }
}

async function refresh(token: string) {
  if (!refreshJwt) {
    throw new Error("[jwt] - Don't finded token for refresh jwt, generate running 'npx @ug.software/opposer jwt generate' or consulting documentation.");
  }

  try {
    const user = jwt.verify(token, refreshJwt) as SignJwt;

    return user;
  } catch (err) {
    var erro = err as ErrorJwt;
    if (erro.name === 'TokenExpiredError') {
      return erro.message;
    }

    if (erro.name === 'JsonWebTokenError') {
      return 'Check your data and try again.';
    }
  }
}

async function sign({ exp, ...payload }: SignJwt) {
  if (!accessJwt) {
    throw new Error("[jwt] - Don't finded token secret, generate running 'npx @ug.software/opposer jwt generate' or consulting documentation.");
  }

  const token = jwt.sign({ ...payload }, accessJwt, { expiresIn: '15m' });
  const refresh = jwt.sign({ ...payload }, refreshJwt, {
    expiresIn: '15d',
  });
  return { token, refresh };
}

async function forget(payload: ForgetJwt) {
  if (!recoverJwt) {
    throw new Error("[jwt] - Don't finded token secret for recover password, generate running 'npx @ug.software/opposer jwt generate' or consulting documentation.");
  }

  const token = jwt.sign(payload, accessJwt, { expiresIn: '5m' });
  return { token };
}

async function recover(token: string) {
  if (!recoverJwt) {
    throw new Error("[jwt] - Don't finded token secret for recover password, generate running 'npx @ug.software/opposer jwt generate' or consulting documentation.");
  }

  try {
    const user = jwt.verify(token, recoverJwt) as ForgetJwt;

    return user;
  } catch (err) {
    var erro = err as ErrorJwt;
    if (erro.name === 'TokenExpiredError') {
      return erro.message;
    }

    if (erro.name === 'JsonWebTokenError') {
      return 'Check your data and try again.';
    }
  }
}

async function verify(token: string) {
  try {
    const secret = process.env.OPPOSER_JWT_ACCESS || settings.jwt?.access;
    jwt.verify(token, secret as any);
    return true;
  } catch (err) {
    var erro = err as ErrorJwt;
    if (erro.name === 'TokenExpiredError') {
      return erro.message;
    }

    if (erro.name === 'JsonWebTokenError') {
      return 'Check your data and try again.';
    }
  }
}

export default { verify, sign, forget, validate: { access, refresh, recover } };
