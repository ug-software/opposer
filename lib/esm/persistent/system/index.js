import path from "path";
import fs from "fs";
export default new (class {
    constructor() {
        this.settings = this.getSettingsFile();
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
            // It's okay if the file doesn't exist, we fallback to defaults and env vars
        }
        // Default structure
        config.cache = config.cache || {};
        config.cache.snapshot = config.cache.snapshot || {};
        config.cache.session = config.cache.session || {};
        config.cache.global = config.cache.global || {};
        // Override with Environment Variables
        config.cache.type = process.env.OPPOSER_CACHE_TYPE || config.cache.type || "in-memory";
        config.cache.snapshot.active = process.env.OPPOSER_CACHE_SNAPSHOT === "true"
            || config.cache.snapshot.active
            || false;
        config.cache.snapshot.timer = process.env.OPPOSER_CACHE_SNAPSHOT_TIMER
            ? parseInt(process.env.OPPOSER_CACHE_SNAPSHOT_TIMER)
            : config.cache.snapshot.timer || 1;
        config.cache.snapshot.unit = process.env.OPPOSER_CACHE_SNAPSHOT_UNIT
            || config.cache.snapshot.unit
            || "minutes";
        return config;
    }
    getAllSessionData() { }
})();
