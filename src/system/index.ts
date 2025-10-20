import path from "path";
import fs from "fs";
import { SchemaResult } from "../interfaces/schema";
import { OpposerSystemConfigOptions } from "../interfaces/system";

export function getFileName(
  filePath: string,
  withExtension: boolean = true
): string {
  if (withExtension) {
    return path.basename(filePath);
  } else {
    return path.basename(filePath, path.extname(filePath));
  }
}

export async function getAllSchemas(): Promise<
  ({ name: string } & SchemaResult)[]
> {
  var root = process.cwd();

  var schemasPath = path.resolve(root, "src", "schemas");
  const schemaFiles = fs.readdirSync(schemasPath);

  return await Promise.all(
    schemaFiles.map(async (schemaPathName) => {
      var name = getFileName(schemaPathName, false);

      var schema: SchemaResult = //@ts-ignore
        (await import(path.resolve(schemasPath, schemaPathName))).default;

      return {
        name,
        ...schema,
      };
    })
  );
}

export function getSettingsFile(): OpposerSystemConfigOptions {
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
