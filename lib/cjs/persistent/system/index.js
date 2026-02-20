"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.default = new (class {
    constructor() {
        this.settings = this.getSettingsFile();
    }
    getSettingsFile() {
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
    getAllSessionData() { }
})();
