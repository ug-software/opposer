import { OpposerSystemConfigOptions, ClassType } from "../interfaces/system.js";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";

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
  const root = process.cwd();
  const schemasPath = path.resolve(root, "src", "schemas");
  const schemaFiles = fs.readdirSync(schemasPath);

  return await Promise.all(
    schemaFiles.map(async (schemaPathName) => {
      const name = getFileName(schemaPathName, false);
      const filePath = path.resolve(schemasPath, schemaPathName);
      const fileUrl = pathToFileURL(filePath).href;

      //@ts-ignore
      const entity: any = (await import(fileUrl)).default;

      return { name, entity };
    })
  );
}

export async function getAllHandlers(): Promise<ClassType<any>[]> {
  const root = process.cwd();
  const handlersPath = path.resolve(root, "src", "handlers");

  const handlersFiles = getAllFiles(handlersPath);
  return await Promise.all(
    handlersFiles.map(async (filePath) => {
      const fileUrl = pathToFileURL(filePath).href;

      //@ts-ignore
      return (await import(fileUrl)).default;
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
