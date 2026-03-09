"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cors;
function cors(options) {
    return (req, res, next) => {
        const originHeader = req.headers.origin;
        let allowedOrigin = "*";
        if (options?.origin) {
            if (Array.isArray(options.origin)) {
                if (originHeader && options.origin.includes(originHeader)) {
                    allowedOrigin = originHeader;
                }
                else {
                    allowedOrigin = options.origin[0]; // Fallback to first one
                }
            }
            else {
                allowedOrigin = options.origin;
            }
        }
        res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, opposer-key");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
            return;
        }
        next();
    };
}
