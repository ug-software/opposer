import { OpposerSystemConfigOptions, ClassType } from "../interfaces/system.js";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import ChangeRequestPassword from "../server/security/models/crp.js";
import Key from "../server/security/models/ke.js";
import Role from "../server/security/models/rl.js";
import Session from "../server/security/models/se.js";
import User from "../server/security/models/usr.js";
import { OpposerDatabase } from "../orm/opposer.js";
import Context from "../persistent/context/index.js";
import { MetadataStore } from "../orm/metadata.js";

export class OpposerSystem {
  getFileName(filePath: string, withExtension: boolean = true): string {
    if (withExtension) {
      return path.basename(filePath);
    } else {
      return path.basename(filePath, path.extname(filePath));
    }
  }

  async getAllModels(): Promise<{ name: string; entity: any }[]> {
    const allEntities = MetadataStore.getAllEntities();
    const settings = this.getSettingsFile();
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

  private getAuthModels(
    settings: OpposerSystemConfigOptions
  ): { name: string; entity: any }[] {
    if (settings.auth) {
      return [
        { name: "crp", entity: ChangeRequestPassword },
        { name: "ke", entity: Key },
        { name: "rl", entity: Role },
        { name: "se", entity: Session },
        { name: "usr", entity: User },
      ];
    }
    return [];
  }

  async getAllHandlers(customHandlersPath?: string): Promise<ClassType<any>[]> {
    const settings = this.getSettingsFile();
    const root = process.cwd();
    let handlersPath =
      customHandlersPath || path.resolve(root, "src", "handlers");

    if (!customHandlersPath && settings.handlers) {
      handlersPath = path.resolve(root, settings.handlers, "handlers");
    }

    if (!fs.existsSync(handlersPath)) {
      return [];
    }

    const handlersFiles = this.getAllFiles(handlersPath);
    return await Promise.all(
      handlersFiles.map(async (filePath) => {
        const fileUrl = pathToFileURL(filePath).href;

        //@ts-ignore
        return (await import(fileUrl)).default;
      })
    );
  }

  getSettingsFile(): OpposerSystemConfigOptions {
    let config: Partial<OpposerSystemConfigOptions> = {};

    try {
      const root = process.cwd();
      const configPath = path.resolve(root, "opposer-settings.json");
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, "utf8");
        config = JSON.parse(fileContent);
      }
    } catch (error) {
      // Normal if file doesn't exist
    }

    // Override with Environment Variables
    config.port = process.env.OPPOSER_PORT
      ? parseInt(process.env.OPPOSER_PORT)
      : config.port || 3000;
    config.url = process.env.OPPOSER_URL || config.url;

    if (process.env.OPPOSER_DATABASE_TYPE || config.database) {
      config.database = {
        ...(config.database as any),
        type:
          (process.env.OPPOSER_DATABASE_TYPE as any) ||
          (config.database as any)?.type,
        host:
          process.env.OPPOSER_DATABASE_HOST || (config.database as any)?.host,
        port: process.env.OPPOSER_DATABASE_PORT
          ? parseInt(process.env.OPPOSER_DATABASE_PORT)
          : (config.database as any)?.port,
        username:
          process.env.OPPOSER_DATABASE_USER ||
          (config.database as any)?.username,
        password:
          process.env.OPPOSER_DATABASE_PASSWORD ||
          (config.database as any)?.password,
        database:
          process.env.OPPOSER_DATABASE_NAME ||
          (config.database as any)?.database,
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
        password:
          process.env.OPPOSER_MANAGER_PASSWORD ||
          config.manager?.password ||
          "",
        firstName:
          process.env.OPPOSER_MANAGER_FIRST_NAME ||
          config.manager?.firstName ||
          "",
        lastName:
          process.env.OPPOSER_MANAGER_LAST_NAME ||
          config.manager?.lastName ||
          "",
      };
    }

    return config as OpposerSystemConfigOptions;
  }

  getAllFiles(dir: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return [];

    const list = fs.readdirSync(dir, { withFileTypes: true });

    list.forEach((file) => {
      const filePath = path.resolve(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(this.getAllFiles(filePath));
      } else if (
        file.isFile() &&
        (file.name.endsWith(".js") || file.name.endsWith(".ts"))
      ) {
        results.push(filePath);
      }
    });

    return results;
  }

  saveSettingsFile(settings: any) {
    const root = process.cwd();
    const configPath = path.resolve(root, "opposer-settings.json");

    return fs.writeFileSync(configPath, JSON.stringify(settings, null, 2), {
      encoding: "utf8",
    });
  }
}

const system = new OpposerSystem();
export default system;
