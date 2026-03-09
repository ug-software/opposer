"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Playground;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const index_js_1 = __importDefault(require("../system/index.js"));
const index_js_2 = require("../server/decorators/index.js");
const index_js_3 = require("../orm/index.js");
const index_js_4 = require("../server/index.js");
// @ts-ignore
const _dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : // @ts-ignore
        path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
async function generateMap(server, models, handlers) {
    var map = {
        models: {},
        handlers: {},
    };
    var allModels = await index_js_1.default.getAllModels(models);
    const internalModels = ['usr', 'rl', 'se', 'ke', 'crp', 'sh', 'User', 'Role', 'Session', 'Key', 'ChangeRequestPassword', 'ScheduleHistory'];
    if (Array.isArray(allModels)) {
        var modelsMap = allModels
            .filter((m) => !internalModels.includes(m.name))
            .reduce((__models, model) => {
            var fields = (0, index_js_2.getFieldsMetadata)(model.entity);
            const meta = index_js_3.MetadataStore.getEntity(model.entity);
            if (Array.isArray(fields)) {
                var schema = fields.reduce((__schema, field) => {
                    __schema[field.name] = field.schema?.type || 'string';
                    return __schema;
                }, {});
                __models[model.name] = {
                    description: meta?.description || 'Database Entity Definition',
                    schema: schema,
                };
            }
            return __models;
        }, {});
        map.models = modelsMap;
    }
    var allHandlers = await index_js_1.default.getAllHandlers(handlers);
    if (Array.isArray(allHandlers)) {
        var handlersMap = allHandlers.reduce((__handlers, handler) => {
            var handleMetadata = (0, index_js_2.getHandlerMetadata)(handler);
            var allMethods = (0, index_js_2.getMethodMetadata)(handler);
            var allPayloads = (0, index_js_2.getPayloadMetadata)(handler);
            if (Array.isArray(allMethods)) {
                var methods = allMethods.reduce((__methods, method) => {
                    var payload = allPayloads.find((x) => x.name === method.name);
                    if (payload) {
                        var fields = (0, index_js_2.getFieldsMetadata)(payload.dto);
                        if (Array.isArray(fields)) {
                            __methods[method.name] = {
                                payload: fields.reduce((__fields, field) => {
                                    __fields[field.name] = field.schema?.type || 'string';
                                    return __fields;
                                }, {}),
                            };
                        }
                    }
                    return __methods;
                }, {});
                __handlers[handleMetadata.name] = methods;
            }
            return __handlers;
        }, {});
        map.handlers = handlersMap;
        const mapPath = path_1.default.resolve(process.cwd(), 'opposer-map.json');
        fs_1.default.writeFileSync(mapPath, JSON.stringify(map, null, 2));
        return map;
    }
    return map;
}
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};
async function Playground(req, res, next) {
    const server = req.server;
    const models = index_js_4.Context.get('models');
    const handlers = index_js_4.Context.get('handlers');
    // Public map endpoint for the Swagger UI
    if (req.url === '/opposer-map.json') {
        const map = await generateMap(server, models, handlers);
        res.status(200).json(map);
        return;
    }
    // Base playground route - Serve static files from build/client
    if (req.url.startsWith('/playground')) {
        await generateMap(server, models, handlers);
        const _buildPath = path_1.default.resolve(_dirname, 'build', 'client');
        let relativePath = req.url.replace('/playground', '');
        if (relativePath === '' || relativePath === '/') {
            relativePath = '/index.html';
        }
        let filePath = path_1.default.join(_buildPath, relativePath);
        // If file doesn't exist, fallback to index.html only if it's a likely page request
        if (!fs_1.default.existsSync(filePath) || fs_1.default.statSync(filePath).isDirectory()) {
            const isAsset = /\.(js|css|png|jpg|gif|svg|ico|json|map)$/.test(relativePath);
            if (!isAsset) {
                filePath = path_1.default.join(_buildPath, 'index.html');
            }
            else {
                res.status(404).json({ message: `Asset ${relativePath} not found.` });
                return;
            }
        }
        const ext = path_1.default.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        try {
            console.log('filePath', filePath);
            const content = fs_1.default.readFileSync(filePath);
            res.setHeader('Content-Type', contentType);
            res.status(200).end(content);
        }
        catch (error) {
            console.log('error', error);
            res.status(500).json({ message: 'Error serving playground file.' });
        }
        return;
    }
    next();
}
