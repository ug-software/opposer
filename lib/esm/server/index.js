import Controller from './controller/index.js';
import system from '../system/index.js';
import permission from './security/middleware/permission.js';
import autorization from './security/middleware/autorization.js';
import Auth from './security/controller/auth.js';
import scheduler from '../scheduler/index.js';
import { OpposerDatabase, PostgresDriver, SQLiteDriver, MySQLDriver } from '../orm/index.js';
import path from 'path';
import fs from 'node:fs/promises';
// Core
import opposerServer from './core/index.js';
import corsMiddleware from './core/middleware/cors.js';
import bodyParser from './core/middleware/body-parser.js';
import loggerMiddleware from './core/middleware/logger.js';
import Context from './context/index.js';
// Playground
import Playground from '../playground/index.js';
const __filename = process.argv[1];
const __dirname = path.dirname(__filename);
async function initializeDatabase(props, models) {
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
async function ensureManager(db, settings, models) {
    if (!settings.auth)
        return;
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
                });
            }
            const hasAllRole = await roleRepository.findOne({
                where: { usr: manager.id, sm: 'all', mt: 'all' },
            });
            if (!hasAllRole) {
                console.log('-> Creating all-access role for manager.');
                await roleRepository.insert({
                    usr: manager.id,
                    sm: 'all',
                    mt: 'all',
                });
            }
        }
    }
    catch (error) {
        console.error('[database] Manager creation failed:', error);
    }
}
export default async function Server(props) {
    console.log('-> Initializing database connection.');
    const settings = system.getSettingsFile();
    if (!settings.database) {
        throw new Error('-> It is necessary to inform database properties.');
    }
    const db = await initializeDatabase(settings.database, props.models);
    await ensureManager(db, settings, props.models);
    let models = props.models;
    if (!models) {
        const pathModels = path.join(__dirname, 'models');
        const stat = await fs.stat(pathModels);
        if (!stat.isDirectory()) {
            throw new Error('Impossible define models, verify docs and try again.');
        }
        models = await system.getAllDefaultFromDir(pathModels);
    }
    let controllers = props.controllers;
    if (!controllers) {
        const pathControllers = path.join(__dirname, 'controllers');
        try {
            const stat = await fs.stat(pathControllers);
            if (!stat.isDirectory()) {
                throw new Error('Impossible define controllers, verify docs and try again.');
            }
            controllers = await system.getAllDefaultFromDir(pathControllers);
        }
        catch (error) {
            controllers = [];
        }
    }
    let schedules = props.schedules;
    if (!schedules) {
        const pathSchedules = path.join(__dirname, 'schedules');
        try {
            const stat = await fs.stat(pathSchedules);
            if (!stat.isDirectory()) {
                throw new Error('Impossible define schedules, verify docs and try again.');
            }
            schedules = await system.getAllDefaultFromDir(pathSchedules);
        }
        catch (error) {
            schedules = [];
        }
    }
    // Store database in server context
    Context.set('db', db);
    Context.set('models', models);
    Context.set('controllers', controllers);
    console.log('-> Initializing scheduler.');
    await scheduler.initialize(schedules);
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
        opposerServer.use(corsMiddleware(props.cors || settings.cors));
    }
    // 3. Body Parser
    opposerServer.use(bodyParser());
    // 4. Playground
    opposerServer.use(Playground);
    // 5. Auth/Security Middlewares
    if (settings.auth) {
        opposerServer.use(autorization);
        opposerServer.use(permission);
    }
    // 6. Main Route Handler
    opposerServer.use(async (req, res, next) => {
        if (req.url === url && req.method === 'POST') {
            await Controller(req, res);
        }
        else {
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
        opposer: opposerServer,
        initialize,
    };
}
export const auth = { social: Auth.social };
export * from './constants/index.js';
export * from './helpers/index.js';
export * from './security/index.js';
export { Method, Controller, Field, Payload, IsPublic, IsPublicMethod, f } from './decorators/index.js';
export { default as Context } from './context/index.js';
