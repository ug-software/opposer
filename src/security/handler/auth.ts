import { Method, Handler } from "../../decorators/index.js";
import {
  PayloadAuthChangePassword,
  PayloadAuthForgetPassword,
  PayloadAuthLogin,
  PayloadAuthRegister,
} from "../../interfaces/security.js";
import { Field } from "../../database/field.js";
import User from "../schema/usr.js";
import { Exception, Success } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import { db } from "../../database/connect.js";
import jwt from "../jwt/index.js";
import Session from "../schema/se.js";
import ChangeRequestPassword from "../schema/crp.js";

@Handler("auth")
export default class Auth {
  @Method()
  async register(payload: PayloadAuthRegister) {
    var errors = Field.validate(User, payload);

    if (Object.keys(errors).length > 0) {
      return Exception({
        ...HttpStatus[400],
        message: errors,
      });
    }

    var userRepository = db.getRepository(User);

    if (await userRepository.findOne({ where: { lg: payload.lg } })) {
      return Exception({
        ...HttpStatus[400],
        message: "User with this login already exists.",
      });
    }

    var usr = userRepository.create(payload);
    await userRepository.save(usr);
    return Success(usr);
  }

  @Method()
  async login(payload: PayloadAuthLogin) {
    if (!payload.lg) {
      return Exception({ ...HttpStatus[400], message: "Login is required" });
    }

    if (!payload.ps) {
      return Exception({ ...HttpStatus[400], message: "Password is required" });
    }

    var userRepository = db.getRepository(User);
    var sessionRepository = db.getRepository(Session);

    var usr = await userRepository.findOne({
      where: { lg: payload.lg },
    });

    if (!usr) {
      return Exception({
        ...HttpStatus[400],
        message: "Invalid login or password, check the data and try again.",
      });
    }

    if (!(await usr.comparePassword(payload.ps))) {
      return Exception({
        ...HttpStatus[400],
        message: "Invalid login or password, check the data and try again.",
      });
    }

    var { token, refresh } = await jwt.sign(usr);

    // register new session init
    await sessionRepository.save({
      ac: true,
      ag: payload.ag,
      ip: payload.ip,
      loi: new Date(),
      rt: refresh,
      usr: usr.id,
    });

    return Success({
      token,
      refresh,
      usr: {
        id: usr.id,
        fn: usr.fn,
        ln: usr.ln,
        lg: usr.lg,
      },
    });
  }

  @Method()
  async refresh(payload: string) {
    if (!payload) {
      return Exception({
        ...HttpStatus[400],
        message: "Refresh token is required.",
      });
    }

    var sessionRepository = db.getRepository(Session);

    var last = await sessionRepository.findOne({
      where: { rt: payload },
    });
    if (!last) {
      return Exception({
        ...HttpStatus[401],
        message: "Don't find session.",
      });
    }

    if (!last.ac) {
      return Exception({
        ...HttpStatus[401],
        message: "Refresh expired.",
      });
    }

    var usr = await jwt.validate.refresh(payload);
    if (!usr || typeof usr === "string") {
      return Exception({
        ...HttpStatus[401],
        message: "Invalid token.",
      });
    }

    //cancel last session and update in database;
    sessionRepository.update(
      { rt: last.rt },
      {
        ac: false,
        lou: new Date(),
      }
    );

    var { token, refresh } = await jwt.sign(usr);
    await sessionRepository.save({
      ac: true,
      ag: last.ag,
      ip: last.ip,
      loi: new Date(),
      rt: refresh,
      usr: usr.id,
    });

    return Success({
      token,
      refresh,
      ...usr,
    });
  }

  @Method()
  async logout(payload: string) {
    if (!payload) {
      return Exception({
        ...HttpStatus[400],
        message: "Token is required for logout user.",
      });
    }

    var sessionRepository = db.getRepository(Session);

    await sessionRepository.update(
      { rt: payload },
      {
        ac: false,
        lou: new Date(),
      }
    );
  }

  @Method()
  async me(payload: string) {
    if (!payload) {
      return Exception({
        ...HttpStatus[400],
        message: "Token is required.",
      });
    }

    var usr = await jwt.validate.access(payload);

    if (typeof usr === "string") {
      return Exception({
        ...HttpStatus[401],
        message: "Invalid token.",
      });
    }

    return Success(usr);
  }

  @Method()
  async changePassword(payload: PayloadAuthChangePassword) {
    var errors = Field.validate(User, { ps: payload.ps });

    if (Object.keys(errors).length > 0) {
      return Exception({
        ...HttpStatus[400],
        message: errors,
      });
    }

    if (!payload.tk) {
      return Exception({
        ...HttpStatus[400],
        message: "Ticket is required for change password.",
      });
    }

    var ticket = await jwt.validate.recover(payload.tk);
    if (typeof ticket === "string" || !ticket) {
      return Exception({
        ...HttpStatus[401],
        message: "Invalid token.",
      });
    }

    var changePasswordRepository = db.getRepository(ChangeRequestPassword);
    var userRepository = db.getRepository(User);
    var usr = await userRepository.findOne({
      where: { lg: ticket.lg },
    });

    if (!usr) {
      return Exception({
        ...HttpStatus[401],
        message: "Don't find user, verify payload and try again.",
      });
    }

    // finaly update password...
    await userRepository.update({ lg: ticket.lg }, { ps: payload.ps });
    await changePasswordRepository.update({ tk: payload.tk }, { ud: true });

    return Success({ message: "Succes for change password." });
  }

  @Method()
  async forgotPassword(payload: PayloadAuthForgetPassword) {
    if (!payload.lg) {
      return Exception({
        ...HttpStatus[400],
        message: "Login is required.",
      });
    }

    var { token } = await jwt.forget(payload);

    var changePasswordRepository = db.getRepository(ChangeRequestPassword);
    await changePasswordRepository.save({
      ...payload,
      tk: token,
      et: new Date(new Date().getTime() + 5 * 60 * 1000), // five min
    });

    return Success({ token });
  }
}

/*
    {
        handler: auth,
        method: register,
        payload: {
            em: "",
            ps: ""
        }
    }
*/
