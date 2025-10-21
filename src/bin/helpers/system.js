import fs from "fs";
import path from "path";

function getSettingsFile() {
  try {
    const root = process.cwd();

    const configPath = path.resolve(root, "opposer-settings.json");
    const fileContent = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(fileContent);

    return config;
  } catch (error) {
    throw new Error(
      "[system] - Could not find or read opposer-settings.json in project root. Verify the file and try again."
    );
  }
}

function saveSettingsFile(settings) {
  const root = process.cwd();
  const configPath = path.resolve(root, "opposer-settings.json");

  return fs.writeFileSync(configPath, JSON.stringify(settings, null, 2), {
    encoding: "utf8",
  });
}

export { getSettingsFile, saveSettingsFile };
