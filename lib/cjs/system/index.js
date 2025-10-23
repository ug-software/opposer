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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getFileName(filePath, withExtension = true) {
    if (withExtension) {
        return path_1.default.basename(filePath);
    }
    else {
        return path_1.default.basename(filePath, path_1.default.extname(filePath));
    }
}
async function getAllSchemas() {
    var root = process.cwd();
    var schemasPath = path_1.default.resolve(root, "src", "schemas");
    const schemaFiles = fs_1.default.readdirSync(schemasPath);
    return await Promise.all(schemaFiles.map(async (schemaPathName) => {
        var name = getFileName(schemaPathName, false);
        var entity = //@ts-ignore
         (await Promise.resolve(`${path_1.default.resolve(schemasPath, schemaPathName)}`).then(s => __importStar(require(s)))).default;
        return {
            name,
            entity,
        };
    }));
}
async function getAllHandlers() {
    const root = process.cwd();
    const handlersPath = path_1.default.resolve(root, "src", "handlers");
    const handlersFiles = getAllFiles(handlersPath);
    return await Promise.all(
    //@ts-ignore
    handlersFiles.map(async (filePath) => (await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)))).default));
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
