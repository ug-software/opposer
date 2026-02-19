"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPublicMethod = exports.IsPublic = exports.Payload = exports.Field = exports.Handler = exports.Method = exports.jwt = void 0;
exports.default = Server;
const express_1 = __importDefault(require("express"));
const index_js_1 = __importDefault(require("./controller/index.js"));
const database = __importStar(require("./database/index.js"));
const system = __importStar(require("../system/index.js"));
const permission_js_1 = __importDefault(require("./security/middleware/permission.js"));
const autorization_js_1 = __importDefault(require("./security/middleware/autorization.js"));
const settings = system.getSettingsFile();
async function Server(props) {
    console.log("-> Initializing database connection.");
    if (!settings.database) {
        throw new Error("-> It is necessary to inform database properties.");
    }
    await database.connect(settings.database);
    console.log("-> Initializing server.");
    const opposer = (0, express_1.default)();
    let url = "/opposer";
    if (settings.url) {
        url = settings.url;
    }
    opposer.set("trust proxy", true);
    // parsing Middleware
    opposer.use(express_1.default.json()); // JSON forever active
    if (settings.urlencoded) {
        opposer.use(express_1.default.urlencoded({ extended: true }));
    }
    if (settings.text) {
        opposer.use(express_1.default.text());
    }
    // Security
    if (settings.helmet) {
        //@ts-ignore
        const helmet = (await Promise.resolve().then(() => __importStar(require("helmet")))).default;
        opposer.use(helmet());
    }
    // CORS
    if (props.cors) {
        //@ts-ignore
        const cors = (await Promise.resolve().then(() => __importStar(require("cors")))).default;
        opposer.use(cors({ ...props.cors }));
    }
    // Rate limit
    if (settings.rateLimit) {
        //@ts-ignore
        const rateLimit = (await Promise.resolve().then(() => __importStar(require("express-rate-limit")))).default;
        opposer.use(rateLimit({
            windowMs: settings.rateLimit.windowMs || 15 * 60 * 1000, // 15 minutos por padrão
            max: settings.rateLimit.max || 100, // máximo 100 requests por IP
        }));
    }
    // Logging
    if (settings.logger) {
        //@ts-ignore
        const morgan = (await Promise.resolve().then(() => __importStar(require("morgan")))).default;
        opposer.use(morgan("dev"));
    }
    //Auth middleware
    if (settings.auth) {
        opposer.use(autorization_js_1.default);
        opposer.use(permission_js_1.default);
    }
    // Routes
    opposer.post(url, index_js_1.default);
    // Error Middleware
    opposer.use((err, req, res, next) => {
        console.error(err);
        res
            .status(err.status || 500)
            .json({ message: err.message || "Internal Server Error" });
    });
    function initialize() {
        opposer.listen(settings.port, () => {
            console.log(`⚡Opposer is running in port ${settings.port}`);
        });
    }
    return { opposer, initialize };
}
var index_js_2 = require("./security/jwt/index.js");
Object.defineProperty(exports, "jwt", { enumerable: true, get: function () { return __importDefault(index_js_2).default; } });
__exportStar(require("./database/index.js"), exports);
__exportStar(require("./constants/index.js"), exports);
__exportStar(require("./helpers/index.js"), exports);
var index_js_3 = require("./decorators/index.js");
Object.defineProperty(exports, "Method", { enumerable: true, get: function () { return index_js_3.Method; } });
Object.defineProperty(exports, "Handler", { enumerable: true, get: function () { return index_js_3.Handler; } });
Object.defineProperty(exports, "Field", { enumerable: true, get: function () { return index_js_3.Field; } });
Object.defineProperty(exports, "Payload", { enumerable: true, get: function () { return index_js_3.Payload; } });
Object.defineProperty(exports, "IsPublic", { enumerable: true, get: function () { return index_js_3.IsPublic; } });
Object.defineProperty(exports, "IsPublicMethod", { enumerable: true, get: function () { return index_js_3.IsPublicMethod; } });
