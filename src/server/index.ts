import Controller from './controller/index.js';
import { CreateServerProps, ServerInstance } from '../interfaces/server.js';
import system from '../system/index.js';
import { ClassType } from '../interfaces/system.js';
import permission from './security/middleware/permission.js';
import autorization from './security/middleware/autorization.js';
import Auth from './security/handler/auth.js';
import scheduler from '../scheduler/index.js';
import { OpposerDatabase, PostgresDriver, SQLiteDriver, MySQLDriver } from '../orm/index.js';

// Core
import opposerServer from './core/index.js';
import corsMiddleware from './core/middleware/cors.js';
import bodyParser from './core/middleware/body-parser.js';
import loggerMiddleware from './core/middleware/logger.js';
import Context from './context/index.js';

// Playground
import Playground from '../playground/index.js';

async function initializeDatabase(props: any, models?: string | ClassType<unknown>[]): Promise<OpposerDatabase> {
  const settings = system.getSettingsFile();
  const allModels = await system.getAllModels(models);
  const entities = allModels.map((x) => x.entity);

  let driver;
  const type = props.type || settings.database?.type;

  switch (type) {
    case 'postgres':
      driver = new PostgresDriver(props);
      break;
    case 'sqlite':
      driver = new SQLiteDriver(props);
      break;
    case 'mysql':
      driver = new MySQLDriver(props);
      break;
    default:
      throw new Error(`[database] Unsupported database type: ${type}`);
  }

  const db = new OpposerDatabase(driver, entities);
  await db.connect();

  return db;
}

async function ensureManager(db: OpposerDatabase, settings: any, models?: string | ClassType<unknown>[]) {
  if (!settings.auth) return;

  try {
    const allModels = await system.getAllModels(models);
    const userEntity = allModels.find((x) => x.name === 'User' || x.name === 'usr');
    const roleEntity = allModels.find((x) => x.name === 'Role' || x.name === 'rl');

    if (userEntity && roleEntity) {
      const userRepository = db.getRepository(userEntity.entity);
      const roleRepository = db.getRepository(roleEntity.entity);

      let login = process.env.MANAGER_LOGIN || settings.manager?.login;
      let firstName = process.env.MANAGER_FIRST_NAME || settings.manager?.firstName;
      let lastName = process.env.MANAGER_LAST_NAME || settings.manager?.lastName;
      let password = process.env.MANAGER_PASSWORD || settings.manager?.password;

      let manager = await userRepository.findOne({
        where: { lg: login },
      });

      if (!manager) {
        console.log('-> Creating manager account.');
        manager = await userRepository.insert({
          fn: firstName,
          ln: lastName,
          lg: login,
          ps: password,
          ac: true,
        } as any);
      }

      const hasAllRole = await roleRepository.findOne({
        where: { usr: (manager as any).id, sm: 'all', mt: 'all' },
      });

      if (!hasAllRole) {
        console.log('-> Creating all-access role for manager.');
        await roleRepository.insert({
          usr: (manager as any).id,
          sm: 'all',
          mt: 'all',
        } as any);
      }
    }
  } catch (error) {
    console.error('[database] Manager creation failed:', error);
  }
}

export default async function Server(props: CreateServerProps): Promise<ServerInstance> {
  console.log('-> Initializing database connection.');
  const settings = system.getSettingsFile();

  if (!settings.database) {
    throw new Error('-> It is necessary to inform database properties.');
  }

  const db = await initializeDatabase(settings.database, props.models);
  await ensureManager(db, settings, props.models);

  // Store database in server context
  Context.set('db', db);
  Context.set('models', props.models);
  Context.set('handlers', props.handlers);

  console.log('-> Initializing scheduler.');
  await scheduler.initialize(props.schedules);
  scheduler.start();

  console.log('-> Initializing core server.');
  let url = '/opposer';
  if (settings.url) {
    url = settings.url;
  }

  // 1. Logger
  if (settings.logger) {
    opposerServer.use(loggerMiddleware());
  }

  // 2. CORS (Global)
  if (props.cors || settings.cors) {
    opposerServer.use(corsMiddleware(props.cors || (settings.cors as any)));
  }

  // 3. Body Parser
  opposerServer.use(bodyParser());

  // 4. Playground
  opposerServer.use(Playground);

  // 5. Auth/Security Middlewares
  if (settings.auth) {
    opposerServer.use(autorization as any);
    opposerServer.use(permission as any);
  }

  // 6. Main Route Handler
  opposerServer.use(async (req, res, next) => {
    if (req.url === url && req.method === 'POST') {
      await Controller(req, res);
    } else {
      next();
    }
  });

  // 7. 404 Handler
  opposerServer.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
  });

  function initialize() {
    opposerServer.listen(settings.port, () => {
      console.log(`⚡Opposer Core is running in port ${settings.port}`);
    });
  }

  return {
    opposer: opposerServer as any,
    initialize,
  };
}

export const auth = { social: Auth.social };
export * from './constants/index.js';
export * from './helpers/index.js';
export type { SchemaResult } from '../interfaces/schema.js';
export { Method, Handler, Field, Payload, IsPublic, IsPublicMethod, f } from './decorators/index.js';
export type { PayloadRequest } from '../interfaces/handler.js';

export { default as Context } from './context/index.js';
