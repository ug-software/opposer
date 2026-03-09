import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import ChangeRequestPassword from "../server/security/models/crp.js";
import Key from "../server/security/models/ke.js";
import Role from "../server/security/models/rl.js";
import Session from "../server/security/models/se.js";
import User from "../server/security/models/usr.js";
import ScheduleHistory from "../scheduler/models/history.js";
import { MetadataStore } from "../orm/metadata.js";
export class OpposerSystem {
    getFileName(filePath, withExtension = true) {
        if (withExtension) {
            return path.basename(filePath);
        }
        else {
            return path.basename(filePath, path.extname(filePath));
        }
    }
    async getAllModels(customModels) {
        const settings = this.getSettingsFile();
        const root = process.cwd();
        if (typeof customModels === "string") {
            const modelsPath = path.resolve(root, customModels);
            if (fs.existsSync(modelsPath)) {
                const modelsFiles = this.getAllFiles(modelsPath);
                await Promise.all(modelsFiles.map(async (filePath) => {
                    const fileUrl = pathToFileURL(filePath).href;
                    return await import(fileUrl);
                }));
            }
        }
        else if (Array.isArray(customModels)) {
            // If models are passed as an array, they are already imported/defined.
            // We don't need to do anything here as they should have registered themselves
            // via decorators if they are in the array.
        }
        const allEntities = MetadataStore.getAllEntities();
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
            models.push({ name: "crp", entity: ChangeRequestPassword }, { name: "ke", entity: Key }, { name: "rl", entity: Role }, { name: "se", entity: Session }, { name: "usr", entity: User });
        }
        // Always include ScheduleHistory as it's a core feature
        models.push({ name: "sh", entity: ScheduleHistory });
        return models;
    }
    async getAllControllers(customControllers) {
        const settings = this.getSettingsFile();
        const root = process.cwd();
        // Dynamic import to avoid circular dependency
        const SchedulerController = (await import("../scheduler/controllers/index.js")).default;
        const internalControllers = [SchedulerController];
        if (Array.isArray(customControllers)) {
            return [...internalControllers, ...customControllers];
        }
        let controllersPath = customControllers || path.resolve(root, "src", "controllers");
        if (!customControllers && settings.controllers) {
            controllersPath = path.resolve(root, settings.controllers, "controllers");
        }
        if (!fs.existsSync(controllersPath)) {
            return internalControllers;
        }
        const controllersFiles = this.getAllFiles(controllersPath);
        const userControllers = await Promise.all(controllersFiles.map(async (filePath) => {
            const fileUrl = pathToFileURL(filePath).href;
            //@ts-ignore
            return (await import(fileUrl)).default;
        }));
        return [...internalControllers, ...userControllers.filter((h) => h)];
    }
    async getAllSchedules(customSchedules) {
        const settings = this.getSettingsFile();
        const root = process.cwd();
        if (Array.isArray(customSchedules)) {
            return customSchedules;
        }
        let schedulesPath = customSchedules || path.resolve(root, "src", "schedules");
        if (!customSchedules && settings.schedules) {
            schedulesPath = path.resolve(root, settings.schedules, "schedules");
        }
        if (!fs.existsSync(schedulesPath)) {
            return [];
        }
        const schedulesFiles = this.getAllFiles(schedulesPath);
        const userSchedules = await Promise.all(schedulesFiles.map(async (filePath) => {
            const fileUrl = pathToFileURL(filePath).href;
            //@ts-ignore
            return (await import(fileUrl)).default;
        }));
        return userSchedules.filter((s) => s);
    }
    getSettingsFile() {
        let config = {};
        try {
            const root = process.cwd();
            const configPath = path.resolve(root, "opposer-settings.json");
            if (fs.existsSync(configPath)) {
                const fileContent = fs.readFileSync(configPath, "utf8");
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
        if (!fs.existsSync(dir))
            return [];
        const list = fs.readdirSync(dir, { withFileTypes: true });
        list.forEach((file) => {
            const filePath = path.resolve(dir, file.name);
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
        const configPath = path.resolve(root, "opposer-settings.json");
        return fs.writeFileSync(configPath, JSON.stringify(settings, null, 2), {
            encoding: "utf8",
        });
    }
}
const system = new OpposerSystem();
export default system;
