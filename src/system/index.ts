import path from "path";
import fs from "fs";
import { SchemaResult } from "../interfaces/schema.js";
import { OpposerSystemConfigOptions, ClassType } from "../interfaces/system.js";

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
  { name: string; entity: any }[]
> {
  var root = process.cwd();

  var schemasPath = path.resolve(root, "src", "schemas");
  const schemaFiles = fs.readdirSync(schemasPath);

  return await Promise.all(
    schemaFiles.map(async (schemaPathName) => {
      var name = getFileName(schemaPathName, false);

      var entity: SchemaResult = //@ts-ignore
        (await import(path.resolve(schemasPath, schemaPathName))).default;

      return {
        name,
        entity,
      };
    })
  );
}

export async function getAllReducers(): Promise<ClassType<any>[]> {
  const root = process.cwd();
  const reducersPath = path.resolve(root, "src", "reducers");

  const reducerFiles = getAllFiles(reducersPath);
  return await Promise.all(
    //@ts-ignore
    reducerFiles.map(async (filePath) => (await import(filePath)).default)
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

function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  list.forEach((file) => {
    const filePath = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getAllFiles(filePath)); // entra na subpasta
    } else if (
      file.isFile() &&
      (file.name.endsWith(".js") || file.name.endsWith(".ts"))
    ) {
      results.push(filePath);
    }
  });

  return results;
}
