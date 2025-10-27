import type { OpposerSystemConfigOptions } from "../interfaces/system.js";
import path from "path";
import fs from "fs";

export default new (class {
  settings!: OpposerSystemConfigOptions;

  constructor() {
    this.settings = this.getSettingsFile();
  }

  getSettingsFile(): OpposerSystemConfigOptions {
    try {
      const root = process.cwd();
      const configPath = path.resolve(root, "opposer-settings.json");

      const fileContent = fs.readFileSync(configPath, "utf8");
      const config: OpposerSystemConfigOptions = JSON.parse(fileContent);

      return config;
    } catch (error) {
      throw new Error(
        "[system] - Could not find or read opposer-settings.json in project root. Verify the file and try again."
      );
    }
  }

  getAllSessionData() {}
})();
