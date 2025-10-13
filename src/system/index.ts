import path from "path";
import fs from "fs";
import { EntitySchema } from "typeorm";
import { SchemaResult } from "../interfaces/schema";

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
  { name: string } & SchemaResult[]
> {
  var root = process.cwd();

  var schemasPath = path.resolve(root, "src", "schemas");
  const schemaFiles = fs.readdirSync(schemasPath);

  return await Promise.all(
    schemaFiles.map(async (schemaPathName) => {
      var name = getFileName(schemaPathName);
      var schema: SchemaResult = await import(
        path.resolve(schemasPath, schemaPathName)
      );

      return {
        name,
        ...schema,
      };
    })
  );
}
