import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import ChangeRequestPassword from "../server/security/schema/crp.js";
import Key from "../server/security/schema/ke.js";
import Role from "../server/security/schema/rl.js";
import Session from "../server/security/schema/se.js";
import User from "../server/security/schema/usr.js";
export function getFileName(filePath, withExtension = true) {
    if (withExtension) {
        return path.basename(filePath);
    }
    else {
        return path.basename(filePath, path.extname(filePath));
    }
}
export async function getAllModels() {
    const settings = getSettingsFile();
    const root = process.cwd();
    let modelsPath = path.resolve(root, "src", "models");
    if (settings.models) {
        modelsPath = path.resolve(root, settings.models, "models");
    }
    const schemaFiles = fs.readdirSync(modelsPath);
    const allModels = await Promise.all(schemaFiles.map(async (schemaPathName) => {
        const name = getFileName(schemaPathName, false);
        const filePath = path.resolve(modelsPath, schemaPathName);
        const fileUrl = pathToFileURL(filePath).href;
        //@ts-ignore
        const entity = (await import(fileUrl)).default;
        return { name, entity };
    }));
    if (settings.auth) {
        allModels.push(...[
            { name: "crp", entity: ChangeRequestPassword },
            { name: "ke", entity: Key },
            { name: "rl", entity: Role },
            { name: "se", entity: Session },
            { name: "usr", entity: User },
        ]);
    }
    return allModels;
}
export async function getAllHandlers() {
    const settings = getSettingsFile();
    const root = process.cwd();
    let handlersPath = path.resolve(root, "src", "handlers");
    if (settings.handlers) {
        handlersPath = path.resolve(root, settings.handlers, "handlers");
    }
    const handlersFiles = getAllFiles(handlersPath);
    return await Promise.all(handlersFiles.map(async (filePath) => {
        const fileUrl = pathToFileURL(filePath).href;
        //@ts-ignore
        return (await import(fileUrl)).default;
    }));
}
export function getSettingsFile() {
    try {
        const root = process.cwd();
        const configPath = path.resolve(root, "opposer-settings.json");
        const fileContent = fs.readFileSync(configPath, "utf8");
        const config = JSON.parse(fileContent);
        return config;
    }
    catch (error) {
        throw new Error("[system] - Could not find or read opposer-settings.json in project root. Verify the file and try again.");
    }
}
export function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    list.forEach((file) => {
        const filePath = path.resolve(dir, file.name);
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
export function saveSettingsFile(settings) {
    const root = process.cwd();
    const configPath = path.resolve(root, "opposer-settings.json");
    return fs.writeFileSync(configPath, JSON.stringify(settings, null, 2), {
        encoding: "utf8",
    });
}
