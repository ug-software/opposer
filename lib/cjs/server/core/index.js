"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpposerServer = void 0;
const http_1 = __importDefault(require("http"));
const index_js_1 = __importDefault(require("../../system/index.js"));
const index_js_2 = __importDefault(require("../../persistent/context/index.js"));
class OpposerServer {
    constructor() {
        this.middlewares = [];
        this.settings = index_js_1.default.getSettingsFile();
    }
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    async runMiddlewares(req, res) {
        let index = 0;
        const next = async () => {
            if (index < this.middlewares.length) {
                const middleware = this.middlewares[index++];
                await middleware(req, res, next);
            }
        };
        await next();
    }
    async handleRequest(req, res) {
        const extendedReq = req;
        const extendedRes = res;
        await index_js_2.default.run({ server: this, req: extendedReq, res: extendedRes }, async () => {
            // Inject server instance into request for easy access
            extendedReq.server = this;
            // Request properties
            extendedReq.ip = req.socket.remoteAddress;
            extendedReq.cookies = this.parseCookies(req.headers.cookie || '');
            // Response helpers
            extendedRes.status = (code) => {
                extendedRes.statusCode = code;
                return extendedRes;
            };
            extendedRes.json = (data) => {
                if (!res.writableEnded) {
                    extendedRes.setHeader('Content-Type', 'application/json');
                    extendedRes.end(JSON.stringify(data));
                }
            };
            extendedRes.send = (data) => {
                if (!res.writableEnded) {
                    if (typeof data === 'object')
                        return extendedRes.json(data);
                    extendedRes.end(data);
                }
            };
            extendedRes.cookie = (name, value, options = {}) => {
                let cookieStr = `${name}=${value}`;
                if (options.httpOnly)
                    cookieStr += '; HttpOnly';
                if (options.secure)
                    cookieStr += '; Secure';
                if (options.path)
                    cookieStr += `; Path=${options.path}`;
                if (options.expires)
                    cookieStr += `; Expires=${options.expires.toUTCString()}`;
                if (options.sameSite)
                    cookieStr += `; SameSite=${options.sameSite}`;
                const existing = res.getHeader('Set-Cookie');
                if (!existing) {
                    res.setHeader('Set-Cookie', [cookieStr]);
                }
                else {
                    const cookies = Array.isArray(existing) ? existing : [String(existing)];
                    cookies.push(cookieStr);
                    res.setHeader('Set-Cookie', cookies);
                }
            };
            extendedRes.clearCookie = (name, options = {}) => {
                extendedRes.cookie(name, '', { ...options, expires: new Date(0) });
            };
            try {
                await this.runMiddlewares(extendedReq, extendedRes);
            }
            catch (error) {
                console.error('[core] Server error:', error);
                if (!res.writableEnded) {
                    extendedRes.status(500).json({ message: error.message || 'Internal Server Error' });
                }
            }
        });
    }
    parseCookies(cookieHeader) {
        const cookies = {};
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            if (parts.length === 2) {
                cookies[parts[0].trim()] = parts[1].trim();
            }
        });
        return cookies;
    }
    listen(port, callback) {
        const server = http_1.default.createServer((req, res) => this.handleRequest(req, res));
        server.listen(port, callback);
        return server;
    }
}
exports.OpposerServer = OpposerServer;
const instance = new OpposerServer();
exports.default = instance;
