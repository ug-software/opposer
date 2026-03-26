import { OpposerSystemConfigOptions, ClassType, ModelDefinition } from '../interfaces/system.js';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
import fsAsync from 'node:fs/promises';
import ChangeRequestPassword from '../server/security/models/crp.js';
import Key from '../server/security/models/ke.js';
import Role from '../server/security/models/rl.js';
import Session from '../server/security/models/se.js';
import User from '../server/security/models/usr.js';
import ScheduleHistory from '../scheduler/models/history.js';
import { MetadataStore } from '../orm/metadata.js';

export class OpposerSystem {
  getFileName(filePath: string, withExtension: boolean = true): string {
    if (withExtension) {
      return path.basename(filePath);
    } else {
      return path.basename(filePath, path.extname(filePath));
    }
  }

  async getAllModels(customModels?: string | ClassType<unknown>[]): Promise<ModelDefinition[]> {
    const settings = this.getSettingsFile();
    const root = process.cwd();

    if (typeof customModels === 'string') {
      const modelsPath = path.resolve(root, customModels);
      if (fs.existsSync(modelsPath)) {
        const modelsFiles = this.getAllFiles(modelsPath);
        await Promise.all(
          modelsFiles.map(async (filePath) => {
            const fileUrl = pathToFileURL(filePath).href;
            return await import(fileUrl);
          }),
        );
      }
    } else if (Array.isArray(customModels)) {
      // If models are passed as an array, they are already imported/defined.
      // We don't need to do anything here as they should have registered themselves
      // via decorators if they are in the array.
    }

    const allEntities = MetadataStore.getAllEntities();
    const authModels = this.getAuthModels(settings);

    const models: ModelDefinition[] = allEntities.map((meta) => ({
      name: meta.name,
      entity: meta.target as ClassType<unknown>,
    }));

    // Combine with auth models if they aren't already there
    authModels.forEach((auth) => {
      if (!models.find((m) => m.name === auth.name)) {
        models.push(auth);
      }
    });

    return models;
  }

  private getAuthModels(settings: OpposerSystemConfigOptions): ModelDefinition[] {
    const models: ModelDefinition[] = [];
    if (settings.auth) {
      models.push(
        { name: 'crp', entity: ChangeRequestPassword as unknown as ClassType<unknown> },
        { name: 'ke', entity: Key as unknown as ClassType<unknown> },
        { name: 'rl', entity: Role as unknown as ClassType<unknown> },
        { name: 'se', entity: Session as unknown as ClassType<unknown> },
        { name: 'usr', entity: User as unknown as ClassType<unknown> },
      );
    }
    // Always include ScheduleHistory as it's a core feature
    models.push({ name: 'sh', entity: ScheduleHistory as unknown as ClassType<unknown> });
    return models;
  }

  async getAllControllers(customControllers?: string | ClassType<unknown>[]): Promise<ClassType<unknown>[]> {
    const settings = this.getSettingsFile();
    const root = process.cwd();

    // Dynamic import to avoid circular dependency
    const SchedulerController = (await import('../scheduler/controllers/index.js')).default;
    const internalControllers: ClassType<unknown>[] = [SchedulerController as unknown as ClassType<unknown>];

    if (Array.isArray(customControllers)) {
      return [...internalControllers, ...customControllers];
    }

    let controllersPath = (customControllers as string) || path.resolve(root, 'src', 'controllers');

    if (!customControllers && settings.controllers) {
      controllersPath = path.resolve(root, settings.controllers, 'controllers');
    }

    if (!fs.existsSync(controllersPath)) {
      return internalControllers;
    }

    const controllersFiles = this.getAllFiles(controllersPath);
    const userControllers = await Promise.all(
      controllersFiles.map(async (filePath) => {
        const fileUrl = pathToFileURL(filePath).href;

        //@ts-ignore
        return (await import(fileUrl)).default;
      }),
    );

    return [...internalControllers, ...userControllers.filter((h) => h)];
  }

  async getAllSchedules(customSchedules?: string | ClassType<unknown>[]): Promise<ClassType<unknown>[]> {
    const settings = this.getSettingsFile();
    const root = process.cwd();

    if (Array.isArray(customSchedules)) {
      return customSchedules;
    }

    let schedulesPath = (customSchedules as string) || path.resolve(root, 'src', 'schedules');

    if (!customSchedules && settings.schedules) {
      schedulesPath = path.resolve(root, settings.schedules, 'schedules');
    }

    if (!fs.existsSync(schedulesPath)) {
      return [];
    }

    const schedulesFiles = this.getAllFiles(schedulesPath);
    const userSchedules = await Promise.all(
      schedulesFiles.map(async (filePath) => {
        const fileUrl = pathToFileURL(filePath).href;

        //@ts-ignore
        return (await import(fileUrl)).default;
      }),
    );

    return userSchedules.filter((s) => s);
  }

  getSettingsFile(): OpposerSystemConfigOptions {
    let config: Partial<OpposerSystemConfigOptions> = {};

    try {
      const root = process.cwd();
      const configPath = path.resolve(root, 'opposer-settings.json');
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(fileContent);
      }
    } catch (error) {
      // Normal if file doesn't exist
    }

    // Override with Environment Variables
    config.port = process.env.OPPOSER_PORT ? parseInt(process.env.OPPOSER_PORT) : config.port || 3000;
    config.url = process.env.OPPOSER_URL || config.url;
    config.auth = process.env.OPPOSER_AUTH ? JSON.parse(process.env.OPPOSER_AUTH) : config.auth || false;

    if (process.env.OPPOSER_DATABASE_TYPE || config.database) {
      config.database = {
        ...(config.database as any),
        type: (process.env.OPPOSER_DATABASE_TYPE as any) || (config.database as any)?.type,
        host: process.env.OPPOSER_DATABASE_HOST || (config.database as any)?.host,
        port: process.env.OPPOSER_DATABASE_PORT ? parseInt(process.env.OPPOSER_DATABASE_PORT) : (config.database as any)?.port,
        username: process.env.OPPOSER_DATABASE_USER || (config.database as any)?.username,
        password: process.env.OPPOSER_DATABASE_PASSWORD || (config.database as any)?.password,
        database: process.env.OPPOSER_DATABASE_NAME || (config.database as any)?.database,
        logging: process.env.OPPOSER_DATABASE_LOGGING === 'true' || (config.database as any)?.logging,
      };
    }

    if (process.env.OPPOSER_JWT_ACCESS || config.jwt) {
      config.jwt = {
        ...(config.jwt || { access: '', refresh: '', recover: '' }),
        access: process.env.OPPOSER_JWT_ACCESS || config.jwt?.access || '',
        refresh: process.env.OPPOSER_JWT_REFRESH || config.jwt?.refresh || '',
        recover: process.env.OPPOSER_JWT_RECOVER || config.jwt?.recover || '',
      };
    }

    if (process.env.OPPOSER_MANAGER_LOGIN || config.manager) {
      config.manager = {
        ...(config.manager || {
          login: '',
          password: '',
          firstName: '',
          lastName: '',
        }),
        login: process.env.OPPOSER_MANAGER_LOGIN || config.manager?.login || '',
        password: process.env.OPPOSER_MANAGER_PASSWORD || config.manager?.password || '',
        firstName: process.env.OPPOSER_MANAGER_FIRST_NAME || config.manager?.firstName || '',
        lastName: process.env.OPPOSER_MANAGER_LAST_NAME || config.manager?.lastName || '',
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
      } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.ts'))) {
        results.push(filePath);
      }
    });

    return results;
  }

  saveSettingsFile(settings: OpposerSystemConfigOptions) {
    const root = process.cwd();
    const configPath = path.resolve(root, 'opposer-settings.json');

    return fs.writeFileSync(configPath, JSON.stringify(settings, null, 2), {
      encoding: 'utf8',
    });
  }

  async getAllDefaultFromDir(dir: string) {
    const files = await fsAsync.readdir(dir);

    const classes = [];

    for (const file of files) {
      // filtra só .js (ou .ts se estiver em runtime compatível)
      if (!file.endsWith('.js')) continue;

      const fullPath = path.join(dir, file);

      // import dinâmico precisa de URL
      //@ts-ignore
      const module = await import(pathToFileURL(fullPath).href);

      if (module.default) {
        classes.push(module.default);
      }
    }

    return classes;
  }
}

const system = new OpposerSystem();
export default system;
