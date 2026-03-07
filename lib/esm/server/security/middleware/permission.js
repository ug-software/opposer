import { Exception } from '../../helpers/index.js';
import { HttpStatus } from '../../constants/index.js';
import jwt from '../jwt/index.js';
import system from '../../../system/index.js';
import { getIsPublicMetadata, getIsPublicMethodMetadata } from '../../../server/decorators/index.js';
import Session from '../models/se.js';
import { Context } from '../../index.js';
export default async (req, res, next) => {
    const host = req.headers.host;
    const referer = req.headers.referer;
    // Bypass for playground or same domain requests
    if (referer && host && referer.includes(host)) {
        return next();
    }
    const request = req.body;
    //skep session method
    if (['login', 'register', 'refresh'].includes(request.method)) {
        return next();
    }
    //skep for public models
    if (request.model) {
        const customModels = Context.get('models');
        var allModels = await system.getAllModels(customModels);
        var model = allModels.find((x) => x.name === request.model);
        if (model) {
            var isPublic = getIsPublicMetadata(model.entity);
            if (isPublic) {
                return next();
            }
        }
    }
    //skep for public methods
    if (request.handler) {
        const customHandlers = Context.get('handlers');
        const allHandlers = await system.getAllHandlers(customHandlers);
        var handler = allHandlers.find((x) => x.name.toUpperCase() === request.handler?.toUpperCase());
        if (handler) {
            var methods = getIsPublicMethodMetadata(handler);
            if (methods.some((x) => x.name === request.method)) {
                return next();
            }
        }
    }
    const db = req.server.getContext('db');
    var decoded = null;
    const authorization = req.headers.authorization || req.cookies.access_token;
    if (authorization) {
        var token = authorization.replace('Bearer ', '');
        decoded = await jwt.validate.access(token);
    }
    if (typeof decoded === 'string' || !decoded || !authorization) {
        const refresh = req.cookies.refresh_token;
        if (!refresh) {
            return res.status(HttpStatus[403].code).send(Exception({
                ...HttpStatus[403],
                message: "[autorization] - Don't authorized, verify data and try again.",
            }));
        }
        if (!db) {
            return res.status(HttpStatus[500].code).send(Exception({
                ...HttpStatus[500],
                message: '[database] - Database connection not found.',
            }));
        }
        var sessionRepository = db.getRepository(Session);
        var last = await sessionRepository.findOne({
            where: { rt: refresh },
        });
        if (!last) {
            return res.status(HttpStatus[401].code).send(Exception({
                ...HttpStatus[401],
                message: "Don't find session.",
            }));
        }
        //cancel last session and update in database;
        sessionRepository.update({ rt: last.rt }, {
            ac: false,
            lou: new Date(),
        });
        decoded = await jwt.validate.refresh(refresh);
        if (!decoded || typeof decoded === 'string') {
            return res.status(HttpStatus[401].code).send(Exception({
                ...HttpStatus[401],
                message: 'Invalid refresh token.',
            }));
        }
        const { fn, id, lg, ln, rl } = decoded;
        var revalidate = await jwt.sign({ fn, id, lg, ln, rl });
        token = revalidate.token;
        const current = new Date();
        //seta os novos cookies
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            expires: new Date(current.getTime() + 15 * 60 * 1000), // 15 mim
        });
        res.cookie('refresh_token', revalidate.refresh, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            expires: new Date(current.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 dias
        });
        await sessionRepository.insert({
            ac: true,
            ag: last.ag,
            ip: last.ip,
            loi: new Date(),
            rt: refresh,
            usr: decoded.id,
        });
    }
    if (typeof decoded !== 'string' && decoded !== undefined) {
        //manager permission
        if (decoded.rl.some((x) => x.mt === 'all' && x.sm === 'all')) {
            return next();
        }
        //granular permission
        if (!decoded.rl.some((x) => x.mt === request.method && x.sm === request.model)) {
            return res.status(HttpStatus[403].code).send(Exception({
                ...HttpStatus[403],
                message: "[autorization] - Don't authorized, verify our permissions and try again.",
            }));
        }
        return next();
    }
    return res.status(HttpStatus[403].code).send(Exception({
        ...HttpStatus[403],
        message: 'Unabled authorization key.',
    }));
};
