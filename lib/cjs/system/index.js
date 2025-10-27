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
exports.getFileName = getFileName;
exports.getAllSchemas = getAllSchemas;
exports.getAllHandlers = getAllHandlers;
exports.getSettingsFile = getSettingsFile;
exports.getAllFiles = getAllFiles;
exports.saveSettingsFile = saveSettingsFile;
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crp_js_1 = __importDefault(require("../server/security/schema/crp.js"));
const ke_js_1 = __importDefault(require("../server/security/schema/ke.js"));
const rl_js_1 = __importDefault(require("../server/security/schema/rl.js"));
const se_js_1 = __importDefault(require("../server/security/schema/se.js"));
const usr_js_1 = __importDefault(require("../server/security/schema/usr.js"));
function getFileName(filePath, withExtension = true) {
    if (withExtension) {
        return path_1.default.basename(filePath);
    }
    else {
        return path_1.default.basename(filePath, path_1.default.extname(filePath));
    }
}
async function getAllSchemas() {
    const settings = getSettingsFile();
    const root = process.cwd();
    let schemasPath = path_1.default.resolve(root, "src", "schemas");
    if (settings.schemas) {
        schemasPath = path_1.default.resolve(root, settings.schemas, "schemas");
    }
    const schemaFiles = fs_1.default.readdirSync(schemasPath);
    const allSchemas = await Promise.all(schemaFiles.map(async (schemaPathName) => {
        const name = getFileName(schemaPathName, false);
        const filePath = path_1.default.resolve(schemasPath, schemaPathName);
        const fileUrl = (0, url_1.pathToFileURL)(filePath).href;
        //@ts-ignore
        const entity = (await Promise.resolve(`${fileUrl}`).then(s => __importStar(require(s)))).default;
        return { name, entity };
    }));
    if (settings.auth) {
        allSchemas.push(...[
            { name: "crp", entity: crp_js_1.default },
            { name: "ke", entity: ke_js_1.default },
            { name: "rl", entity: rl_js_1.default },
            { name: "se", entity: se_js_1.default },
            { name: "usr", entity: usr_js_1.default },
        ]);
    }
    return allSchemas;
}
async function getAllHandlers() {
    const settings = getSettingsFile();
    const root = process.cwd();
    let handlersPath = path_1.default.resolve(root, "src", "handlers");
    if (settings.handlers) {
        handlersPath = path_1.default.resolve(root, settings.handlers, "handlers");
    }
    const handlersFiles = getAllFiles(handlersPath);
    return await Promise.all(handlersFiles.map(async (filePath) => {
        const fileUrl = (0, url_1.pathToFileURL)(filePath).href;
        //@ts-ignore
        return (await Promise.resolve(`${fileUrl}`).then(s => __importStar(require(s)))).default;
    }));
}
function getSettingsFile() {
    try {
        const root = process.cwd();
        const configPath = path_1.default.resolve(root, "opposer-settings.json");
        const fileContent = fs_1.default.readFileSync(configPath, "utf8");
        const config = JSON.parse(fileContent);
        return config;
    }
    catch (error) {
        throw new Error("[system] - Could not find or read opposer-settings.json in project root. Verify the file and try again.");
    }
}
function getAllFiles(dir) {
    let results = [];
    const list = fs_1.default.readdirSync(dir, { withFileTypes: true });
    list.forEach((file) => {
        const filePath = path_1.default.resolve(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(getAllFiles(filePath)); // entra na subpasta
        }
        else if (file.isFile() &&
            (file.name.endsWith(".js") || file.name.endsWith(".ts"))) {
            results.push(filePath);
        }
    });
    return results;
}
function saveSettingsFile(settings) {
    const root = process.cwd();
    const configPath = path_1.default.resolve(root, "opposer-settings.json");
    return fs_1.default.writeFileSync(configPath, JSON.stringify(settings, null, 2), {
        encoding: "utf8",
    });
}
