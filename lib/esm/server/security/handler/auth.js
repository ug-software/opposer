var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Method, Handler } from "../../decorators/index.js";
import { Field } from "../../database/field.js";
import User from "../schema/usr.js";
import { Exception, Success } from "../../helpers/index.js";
import { HttpStatus } from "../../constants/index.js";
import { db } from "../../database/connect.js";
import jwt from "../jwt/index.js";
import Session from "../schema/se.js";
import ChangeRequestPassword from "../schema/crp.js";
let Auth = class Auth {
    async register(payload) {
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
    async login(payload) {
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
        });
        if (!usr) {
            return Exception({
                ...HttpStatus[400],
                message: "Invalid login or password, check the data and try again.",
            });
        }
        if (!(await usr.comparePassword(payload.data.ps))) {
            return Exception({
                ...HttpStatus[400],
                message: "Invalid login or password, check the data and try again.",
            });
        }
        var { token, refresh } = await jwt.sign({
            fn: usr.fn,
            id: usr.id,
            lg: usr.lg,
            ln: usr.ln,
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
    async refresh(payload) {
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
        sessionRepository.update({ rt: last.rt }, {
            ac: false,
            lou: new Date(),
        });
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
    async logout(payload) {
        if (!payload.data) {
            return Exception({
                ...HttpStatus[400],
                message: "Token is required for logout user.",
            });
        }
        var sessionRepository = db.getRepository(Session);
        await sessionRepository.update({ rt: payload.data }, {
            ac: false,
            lou: new Date(),
        });
    }
    async me(payload) {
        if (!payload.data) {
            return Exception({
                ...HttpStatus[400],
                message: "Token is required.",
            });
        }
        var usr = await jwt.validate.access(payload.data);
        if (typeof usr === "string") {
            return Exception({
                ...HttpStatus[401],
                message: "Invalid token.",
            });
        }
        return Success(usr);
    }
    async changePassword(payload) {
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
        await changePasswordRepository.update({ tk: payload.data.tk }, { ud: true });
        return Success({ message: "Succes for change password." });
    }
    async forgotPassword(payload) {
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
};
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "register", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "login", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "refresh", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "logout", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "me", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "changePassword", null);
__decorate([
    Method(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "forgotPassword", null);
Auth = __decorate([
    Handler("auth")
], Auth);
export default Auth;
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
