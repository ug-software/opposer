import {
    Method,
    Handler,
    IsPublic,
    IsPublicMethod,
} from "../../decorators/index.js";
import {
    PayloadAuthChangePassword,
    PayloadAuthForgetPassword,
    PayloadAuthLogin,
    PayloadAuthRegister,
    PayloadSocialLogin,
} from "../../../interfaces/security.js";
import { Field } from "../../database/field.js";
import User from "../schema/usr.js";
import { Exception, Success } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import { db } from "../../database/connect.js";
import jwt from "../jwt/index.js";
import Session from "../schema/se.js";
import ChangeRequestPassword from "../schema/crp.js";
import { PayloadRequest } from "../../../interfaces/handler.js";
import { SignJwt } from "../../../interfaces/jwt.js";

@Handler("auth")
export default class Auth {
    @Method()
    async register(payload: PayloadRequest<PayloadAuthRegister>) {
        var errors = Field.validate(User, payload.data);

        if (Object.keys(errors).length > 0) {
            return Exception({
                ...HttpStatus[400],
                message: errors,
            });
        }

        var userRepository = db.getRepository(User);

        if (await userRepository.findOne({ where: { lg: payload.data.lg } })) {
            return Exception({
                ...HttpStatus[400],
                message: "User with this login already exists.",
            });
        }

        var usr = userRepository.create(payload.data);
        await userRepository.save(usr);
        return Success(usr);
    }

    @Method()
    async login(payload: PayloadRequest<PayloadAuthLogin>) {
        if (!payload.data.lg) {
            return Exception({
                ...HttpStatus[400],
                message: "Login is required",
            });
        }

        if (!payload.data.ps) {
            return Exception({
                ...HttpStatus[400],
                message: "Password is required",
            });
        }

        var userRepository = db.getRepository(User);
        var sessionRepository = db.getRepository(Session);

        var usr = await userRepository.findOne({
            where: { lg: payload.data.lg },
            relations: ["rl"],
        });

        if (!usr) {
            return Exception({
                ...HttpStatus[400],
                message:
                    "Invalid login or password, check the data and try again.",
            });
        }

        if (!(await usr.comparePassword(payload.data.ps))) {
            return Exception({
                ...HttpStatus[400],
                message:
                    "Invalid login or password, check the data and try again.",
            });
        }

        var { token, refresh } = await jwt.sign({
            fn: usr.fn,
            id: usr.id,
            lg: usr.lg,
            ln: usr.ln,
            exp: 0,
            rl: usr.rl.map(({ sm, mt }) => ({ sm, mt })),
        });

        // register new session init
        await sessionRepository.save({
            ac: true,
            ag: payload.headers.userAgent,
            ip: payload.headers.ip,
            loi: new Date(),
            rt: refresh,
            usr: usr.id,
        });

        const current = new Date();
        payload.headers.cookies.set("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(current.getTime() + 15 * 60 * 1000), // 15 mim
        });

        payload.headers.cookies.set("refresh_token", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(current.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 dias
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
    async refresh(payload: PayloadRequest<string>) {
        if (!payload.data) {
            return Exception({
                ...HttpStatus[400],
                message: "Refresh token is required.",
            });
        }

        var sessionRepository = db.getRepository(Session);

        var last = await sessionRepository.findOne({
            where: { rt: payload.data },
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

        var usr = await jwt.validate.refresh(payload.data);
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
            },
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

        const current = new Date();
        payload.headers.cookies.set("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(current.getTime() + 15 * 60 * 1000), // 15 mim
        });

        payload.headers.cookies.set("refresh_token", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(current.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 dias
        });

        return Success({
            token,
            refresh,
            ...usr,
        });
    }

    @Method()
    async logout(payload: PayloadRequest<string>) {
        const token =
            payload.data || payload.headers.cookies.data.refresh_token;
        if (!token) {
            return Exception({
                ...HttpStatus[400],
                message: "Token is required for logout user.",
            });
        }

        payload.headers.cookies.remove("access_token");
        payload.headers.cookies.remove("refresh_token");

        var sessionRepository = db.getRepository(Session);
        await sessionRepository.update(
            { rt: token },
            {
                ac: false,
                lou: new Date(),
            },
        );
    }

    @Method()
    @IsPublicMethod()
    async me(payload: PayloadRequest<any>) {
        const token = payload.headers.cookies.data.refresh_token;
        if (!token) {
            return null;
        }

        var usr = await jwt.validate.refresh(token);
        if (typeof usr === "string") {
            return null;
        }

        return Success(usr);
    }

    @Method()
    async changePassword(payload: PayloadRequest<PayloadAuthChangePassword>) {
        var errors = Field.validate(User, { ps: payload.data.ps });

        if (Object.keys(errors).length > 0) {
            return Exception({
                ...HttpStatus[400],
                message: errors,
            });
        }

        if (!payload.data.tk) {
            return Exception({
                ...HttpStatus[400],
                message: "Ticket is required for change password.",
            });
        }

        var ticket = await jwt.validate.recover(payload.data.tk);
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
        await userRepository.update({ lg: ticket.lg }, { ps: payload.data.ps });
        await changePasswordRepository.update(
            { tk: payload.data.tk },
            { ud: true },
        );

        return Success({ message: "Succes for change password." });
    }

    @Method()
    async forgotPassword(payload: PayloadRequest<PayloadAuthForgetPassword>) {
        if (!payload.data.lg) {
            return Exception({
                ...HttpStatus[400],
                message: "Login is required.",
            });
        }

        var { token } = await jwt.forget(payload.data);

        var changePasswordRepository = db.getRepository(ChangeRequestPassword);
        await changePasswordRepository.save({
            ...payload.data,
            tk: token,
            et: new Date(new Date().getTime() + 5 * 60 * 1000), // five min
        });

        return Success({ token });
    }

    static async social(payload: PayloadRequest<PayloadSocialLogin>) {
        const usr = payload.data;
        var sessionRepository = db.getRepository(Session);
        var { token, refresh } = await jwt.sign({
            ...usr,
            exp: 0,
        });

        // register new session init
        await sessionRepository.save({
            ac: true,
            ag: payload.headers.userAgent,
            ip: payload.headers.ip,
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
}

/*
    {
        handler: auth,
        method: register,
        payload: {
          data: {
            em: "",
            ps: ""
          }
        }
    }
*/
