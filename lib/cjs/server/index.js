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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.f = exports.IsPublicMethod = exports.IsPublic = exports.Payload = exports.Field = exports.Handler = exports.Method = exports.auth = void 0;
exports.default = Server;
const index_js_1 = __importDefault(require("./controller/index.js"));
const index_js_2 = __importDefault(require("../system/index.js"));
const permission_js_1 = __importDefault(require("./security/middleware/permission.js"));
const autorization_js_1 = __importDefault(require("./security/middleware/autorization.js"));
const auth_js_1 = __importDefault(require("./security/handler/auth.js"));
const index_js_3 = __importDefault(require("../scheduler/index.js"));
const index_js_4 = require("../orm/index.js");
// Core
const index_js_5 = __importDefault(require("./core/index.js"));
const cors_js_1 = __importDefault(require("./core/middleware/cors.js"));
const body_parser_js_1 = __importDefault(require("./core/middleware/body-parser.js"));
const logger_js_1 = __importDefault(require("./core/middleware/logger.js"));
// Playground
const index_js_6 = __importDefault(require("../playground/index.js"));
async function initializeDatabase(props, models) {
    const settings = index_js_2.default.getSettingsFile();
    const allModels = await index_js_2.default.getAllModels(models);
    const entities = allModels.map((x) => x.entity);
    let driver;
    const type = props.type || settings.database?.type;
    switch (type) {
        case "postgres":
            driver = new index_js_4.PostgresDriver(props);
            break;
        case "sqlite":
            driver = new index_js_4.SQLiteDriver(props);
            break;
        case "mysql":
            driver = new index_js_4.MySQLDriver(props);
            break;
        default:
            throw new Error(`[database] Unsupported database type: ${type}`);
    }
    const db = new index_js_4.OpposerDatabase(driver, entities);
    await db.connect();
    return db;
}
async function ensureManager(db, settings, models) {
    if (!settings.auth)
        return;
    try {
        const allModels = await index_js_2.default.getAllModels(models);
        const userEntity = allModels.find((x) => x.name === "User" || x.name === "usr");
        const roleEntity = allModels.find((x) => x.name === "Role" || x.name === "rl");
        if (userEntity && roleEntity) {
            const userRepository = db.getRepository(userEntity.entity);
            const roleRepository = db.getRepository(roleEntity.entity);
            let login = process.env.MANAGER_LOGIN || settings.manager?.login;
            let firstName = process.env.MANAGER_FIRST_NAME || settings.manager?.firstName;
            let lastName = process.env.MANAGER_LAST_NAME || settings.manager?.lastName;
            let password = process.env.MANAGER_PASSWORD || settings.manager?.password;
            let manager = await userRepository.findOne({
                where: { lg: login },
            });
            if (!manager) {
                console.log("-> Creating manager account.");
                manager = await userRepository.insert({
                    fn: firstName,
                    ln: lastName,
                    lg: login,
                    ps: password,
                    ac: true,
                });
            }
            const hasAllRole = await roleRepository.findOne({
                where: { usr: manager.id, sm: "all", mt: "all" },
            });
            if (!hasAllRole) {
                console.log("-> Creating all-access role for manager.");
                await roleRepository.insert({
                    usr: manager.id,
                    sm: "all",
                    mt: "all",
                });
            }
        }
    }
    catch (error) {
        console.error("[database] Manager creation failed:", error);
    }
}
async function Server(props) {
    console.log("-> Initializing database connection.");
    const settings = index_js_2.default.getSettingsFile();
    if (!settings.database) {
        throw new Error("-> It is necessary to inform database properties.");
    }
    const db = await initializeDatabase(settings.database, props.models);
    await ensureManager(db, settings, props.models);
    // Store database in server context
    index_js_5.default.setContext("db", db);
    index_js_5.default.setContext("models", props.models);
    index_js_5.default.setContext("handlers", props.handlers);
    console.log("-> Initializing scheduler.");
    await index_js_3.default.initialize(props.schedules);
    index_js_3.default.start();
    console.log("-> Initializing core server.");
    let url = "/opposer";
    if (settings.url) {
        url = settings.url;
    }
    // 1. Logger
    if (settings.logger) {
        index_js_5.default.use((0, logger_js_1.default)());
    }
    // 2. CORS (Global)
    if (props.cors || settings.cors) {
        index_js_5.default.use((0, cors_js_1.default)(props.cors || settings.cors));
    }
    // 3. Body Parser
    index_js_5.default.use((0, body_parser_js_1.default)());
    // 4. Playground
    index_js_5.default.use(index_js_6.default);
    // 5. Auth/Security Middlewares
    if (settings.auth) {
        index_js_5.default.use(autorization_js_1.default);
        index_js_5.default.use(permission_js_1.default);
    }
    // 6. Main Route Handler
    index_js_5.default.use(async (req, res, next) => {
        if (req.url === url && req.method === "POST") {
            await (0, index_js_1.default)(req, res);
        }
        else {
            next();
        }
    });
    // 7. 404 Handler
    index_js_5.default.use((req, res) => {
        res
            .status(404)
            .json({ message: `Route ${req.method} ${req.url} not found` });
    });
    function initialize() {
        index_js_5.default.listen(settings.port, () => {
            console.log(`⚡Opposer Core is running in port ${settings.port}`);
        });
    }
    return {
        opposer: index_js_5.default,
        initialize,
    };
}
exports.auth = { social: auth_js_1.default.social };
__exportStar(require("./constants/index.js"), exports);
__exportStar(require("./helpers/index.js"), exports);
var index_js_7 = require("./decorators/index.js");
Object.defineProperty(exports, "Method", { enumerable: true, get: function () { return index_js_7.Method; } });
Object.defineProperty(exports, "Handler", { enumerable: true, get: function () { return index_js_7.Handler; } });
Object.defineProperty(exports, "Field", { enumerable: true, get: function () { return index_js_7.Field; } });
Object.defineProperty(exports, "Payload", { enumerable: true, get: function () { return index_js_7.Payload; } });
Object.defineProperty(exports, "IsPublic", { enumerable: true, get: function () { return index_js_7.IsPublic; } });
Object.defineProperty(exports, "IsPublicMethod", { enumerable: true, get: function () { return index_js_7.IsPublicMethod; } });
Object.defineProperty(exports, "f", { enumerable: true, get: function () { return index_js_7.f; } });
