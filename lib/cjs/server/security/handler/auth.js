"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../decorators/index.js");
const field_js_1 = require("../../database/field.js");
const usr_js_1 = __importDefault(require("../schema/usr.js"));
const index_js_2 = require("../../helpers/index.js");
const index_js_3 = require("../../constants/index.js");
const connect_js_1 = require("../../database/connect.js");
const index_js_4 = __importDefault(require("../jwt/index.js"));
const se_js_1 = __importDefault(require("../schema/se.js"));
const crp_js_1 = __importDefault(require("../schema/crp.js"));
let Auth = class Auth {
    async register(payload) {
        var errors = field_js_1.Field.validate(usr_js_1.default, payload.data);
        if (Object.keys(errors).length > 0) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: errors,
            });
        }
        var userRepository = connect_js_1.db.getRepository(usr_js_1.default);
        if (await userRepository.findOne({ where: { lg: payload.data.lg } })) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "User with this login already exists.",
            });
        }
        var usr = userRepository.create(payload.data);
        await userRepository.save(usr);
        return (0, index_js_2.Success)(usr);
    }
    async login(payload) {
        if (!payload.data.lg) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Login is required",
            });
        }
        if (!payload.data.ps) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Password is required",
            });
        }
        var userRepository = connect_js_1.db.getRepository(usr_js_1.default);
        var sessionRepository = connect_js_1.db.getRepository(se_js_1.default);
        var usr = await userRepository.findOne({
            where: { lg: payload.data.lg },
        });
        if (!usr) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Invalid login or password, check the data and try again.",
            });
        }
        if (!(await usr.comparePassword(payload.data.ps))) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Invalid login or password, check the data and try again.",
            });
        }
        var { token, refresh } = await index_js_4.default.sign({
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
        return (0, index_js_2.Success)({
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
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Refresh token is required.",
            });
        }
        var sessionRepository = connect_js_1.db.getRepository(se_js_1.default);
        var last = await sessionRepository.findOne({
            where: { rt: payload.data },
        });
        if (!last) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[401],
                message: "Don't find session.",
            });
        }
        if (!last.ac) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[401],
                message: "Refresh expired.",
            });
        }
        var usr = await index_js_4.default.validate.refresh(payload.data);
        if (!usr || typeof usr === "string") {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[401],
                message: "Invalid token.",
            });
        }
        //cancel last session and update in database;
        sessionRepository.update({ rt: last.rt }, {
            ac: false,
            lou: new Date(),
        });
        var { token, refresh } = await index_js_4.default.sign(usr);
        await sessionRepository.save({
            ac: true,
            ag: last.ag,
            ip: last.ip,
            loi: new Date(),
            rt: refresh,
            usr: usr.id,
        });
        return (0, index_js_2.Success)({
            token,
            refresh,
            ...usr,
        });
    }
    async logout(payload) {
        if (!payload.data) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Token is required for logout user.",
            });
        }
        var sessionRepository = connect_js_1.db.getRepository(se_js_1.default);
        await sessionRepository.update({ rt: payload.data }, {
            ac: false,
            lou: new Date(),
        });
    }
    async me(payload) {
        if (!payload.data) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Token is required.",
            });
        }
        var usr = await index_js_4.default.validate.access(payload.data);
        if (typeof usr === "string") {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[401],
                message: "Invalid token.",
            });
        }
        return (0, index_js_2.Success)(usr);
    }
    async changePassword(payload) {
        var errors = field_js_1.Field.validate(usr_js_1.default, { ps: payload.data.ps });
        if (Object.keys(errors).length > 0) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: errors,
            });
        }
        if (!payload.data.tk) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Ticket is required for change password.",
            });
        }
        var ticket = await index_js_4.default.validate.recover(payload.data.tk);
        if (typeof ticket === "string" || !ticket) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[401],
                message: "Invalid token.",
            });
        }
        var changePasswordRepository = connect_js_1.db.getRepository(crp_js_1.default);
        var userRepository = connect_js_1.db.getRepository(usr_js_1.default);
        var usr = await userRepository.findOne({
            where: { lg: ticket.lg },
        });
        if (!usr) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[401],
                message: "Don't find user, verify payload and try again.",
            });
        }
        // finaly update password...
        await userRepository.update({ lg: ticket.lg }, { ps: payload.data.ps });
        await changePasswordRepository.update({ tk: payload.data.tk }, { ud: true });
        return (0, index_js_2.Success)({ message: "Succes for change password." });
    }
    async forgotPassword(payload) {
        if (!payload.data.lg) {
            return (0, index_js_2.Exception)({
                ...index_js_3.HttpStatus[400],
                message: "Login is required.",
            });
        }
        var { token } = await index_js_4.default.forget(payload.data);
        var changePasswordRepository = connect_js_1.db.getRepository(crp_js_1.default);
        await changePasswordRepository.save({
            ...payload.data,
            tk: token,
            et: new Date(new Date().getTime() + 5 * 60 * 1000), // five min
        });
        return (0, index_js_2.Success)({ token });
    }
};
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "register", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "login", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "refresh", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "logout", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "me", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "changePassword", null);
__decorate([
    (0, index_js_1.Method)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Auth.prototype, "forgotPassword", null);
Auth = __decorate([
    (0, index_js_1.Handler)("auth")
], Auth);
exports.default = Auth;
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
