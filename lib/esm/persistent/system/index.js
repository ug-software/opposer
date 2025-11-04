import path from "path";
import fs from "fs";
export default new (class {
    constructor() {
        this.settings = this.getSettingsFile();
    }
    getSettingsFile() {
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
    getAllSessionData() { }
})();
