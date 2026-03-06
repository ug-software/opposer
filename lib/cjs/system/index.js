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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpposerSystem = void 0;
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crp_js_1 = __importDefault(require("../server/security/models/crp.js"));
const ke_js_1 = __importDefault(require("../server/security/models/ke.js"));
const rl_js_1 = __importDefault(require("../server/security/models/rl.js"));
const se_js_1 = __importDefault(require("../server/security/models/se.js"));
const usr_js_1 = __importDefault(require("../server/security/models/usr.js"));
const history_js_1 = __importDefault(require("../scheduler/models/history.js"));
const metadata_js_1 = require("../orm/metadata.js");
class OpposerSystem {
    getFileName(filePath, withExtension = true) {
        if (withExtension) {
            return path_1.default.basename(filePath);
        }
        else {
            return path_1.default.basename(filePath, path_1.default.extname(filePath));
        }
    }
    async getAllModels() {
        const allEntities = metadata_js_1.MetadataStore.getAllEntities();
        const settings = this.getSettingsFile();
        const authModels = this.getAuthModels(settings);
        const models = allEntities.map((meta) => ({
            name: meta.name,
            entity: meta.target,
        }));
        // Combine with auth models if they aren't already there
        authModels.forEach((auth) => {
            if (!models.find((m) => m.name === auth.name)) {
                models.push(auth);
            }
        });
        return models;
    }
    getAuthModels(settings) {
        const models = [];
        if (settings.auth) {
            models.push({ name: "crp", entity: crp_js_1.default }, { name: "ke", entity: ke_js_1.default }, { name: "rl", entity: rl_js_1.default }, { name: "se", entity: se_js_1.default }, { name: "usr", entity: usr_js_1.default });
        }
        // Always include ScheduleHistory as it's a core feature
        models.push({ name: "sh", entity: history_js_1.default });
        return models;
    }
    async getAllHandlers(customHandlersPath) {
        const settings = this.getSettingsFile();
        const root = process.cwd();
        let handlersPath = customHandlersPath || path_1.default.resolve(root, "src", "handlers");
        if (!customHandlersPath && settings.handlers) {
            handlersPath = path_1.default.resolve(root, settings.handlers, "handlers");
        }
        // Dynamic import to avoid circular dependency
        const SchedulerHandler = (await Promise.resolve().then(() => __importStar(require("../scheduler/handlers/index.js")))).default;
        const internalHandlers = [SchedulerHandler];
        if (!fs_1.default.existsSync(handlersPath)) {
            return internalHandlers;
        }
        const handlersFiles = this.getAllFiles(handlersPath);
        const userHandlers = await Promise.all(handlersFiles.map(async (filePath) => {
            const fileUrl = (0, url_1.pathToFileURL)(filePath).href;
            //@ts-ignore
            return (await Promise.resolve(`${fileUrl}`).then(s => __importStar(require(s)))).default;
        }));
        return [...internalHandlers, ...userHandlers.filter((h) => h)];
    }
    getSettingsFile() {
        let config = {};
        try {
            const root = process.cwd();
            const configPath = path_1.default.resolve(root, "opposer-settings.json");
            if (fs_1.default.existsSync(configPath)) {
                const fileContent = fs_1.default.readFileSync(configPath, "utf8");
                config = JSON.parse(fileContent);
            }
        }
        catch (error) {
            // Normal if file doesn't exist
        }
        // Override with Environment Variables
        config.port = process.env.OPPOSER_PORT
            ? parseInt(process.env.OPPOSER_PORT)
            : config.port || 3000;
        config.url = process.env.OPPOSER_URL || config.url;
        if (process.env.OPPOSER_DATABASE_TYPE || config.database) {
            config.database = {
                ...config.database,
                type: process.env.OPPOSER_DATABASE_TYPE ||
                    config.database?.type,
                host: process.env.OPPOSER_DATABASE_HOST || config.database?.host,
                port: process.env.OPPOSER_DATABASE_PORT
                    ? parseInt(process.env.OPPOSER_DATABASE_PORT)
                    : config.database?.port,
                username: process.env.OPPOSER_DATABASE_USER ||
                    config.database?.username,
                password: process.env.OPPOSER_DATABASE_PASSWORD ||
                    config.database?.password,
                database: process.env.OPPOSER_DATABASE_NAME || config.database?.database,
                logging: process.env.OPPOSER_DATABASE_LOGGING === "true" || config.database?.logging,
            };
        }
        if (process.env.OPPOSER_JWT_ACCESS || config.jwt) {
            config.jwt = {
                ...(config.jwt || { access: "", refresh: "", recover: "" }),
                access: process.env.OPPOSER_JWT_ACCESS || config.jwt?.access || "",
                refresh: process.env.OPPOSER_JWT_REFRESH || config.jwt?.refresh || "",
                recover: process.env.OPPOSER_JWT_RECOVER || config.jwt?.recover || "",
            };
        }
        if (process.env.OPPOSER_MANAGER_LOGIN || config.manager) {
            config.manager = {
                ...(config.manager || {
                    login: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                }),
                login: process.env.OPPOSER_MANAGER_LOGIN || config.manager?.login || "",
                password: process.env.OPPOSER_MANAGER_PASSWORD ||
                    config.manager?.password ||
                    "",
                firstName: process.env.OPPOSER_MANAGER_FIRST_NAME ||
                    config.manager?.firstName ||
                    "",
                lastName: process.env.OPPOSER_MANAGER_LAST_NAME ||
                    config.manager?.lastName ||
                    "",
            };
        }
        return config;
    }
    getAllFiles(dir) {
        let results = [];
        if (!fs_1.default.existsSync(dir))
            return [];
        const list = fs_1.default.readdirSync(dir, { withFileTypes: true });
        list.forEach((file) => {
            const filePath = path_1.default.resolve(dir, file.name);
            if (file.isDirectory()) {
                results = results.concat(this.getAllFiles(filePath));
            }
            else if (file.isFile() &&
                (file.name.endsWith(".js") || file.name.endsWith(".ts"))) {
                results.push(filePath);
            }
        });
        return results;
    }
    saveSettingsFile(settings) {
        const root = process.cwd();
        const configPath = path_1.default.resolve(root, "opposer-settings.json");
        return fs_1.default.writeFileSync(configPath, JSON.stringify(settings, null, 2), {
            encoding: "utf8",
        });
    }
}
exports.OpposerSystem = OpposerSystem;
const system = new OpposerSystem();
exports.default = system;
