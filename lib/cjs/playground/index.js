"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Playgroud;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const system = __importStar(require("../system/index.js"));
const index_js_1 = require("../server/decorators/index.js");
async function generateMap() {
    var map = {
        models: {},
        handlers: {},
    };
    var allModels = await system.getAllModels();
    if (Array.isArray(allModels)) {
        var models = allModels.reduce((__models, model) => {
            var fields = (0, index_js_1.getFieldsMetadata)(model.entity);
            if (Array.isArray(fields)) {
                var schema = fields.reduce((__schema, field) => {
                    __schema[field.name] = field.schema.type;
                    return __schema;
                }, {});
                //@ts-ignore
                __models[model.name] = schema;
            }
            return __models;
        }, {});
        map.models = models;
    }
    var allHandlers = await system.getAllHandlers();
    if (Array.isArray(allHandlers)) {
        var handlers = allHandlers.reduce((__handlers, handler) => {
            var handleMetadata = (0, index_js_1.getHandlerMetadata)(handler);
            var allMethods = (0, index_js_1.getMethodMetadata)(handler);
            var allPayloads = (0, index_js_1.getPayloadMetadata)(handler);
            if (Array.isArray(allMethods)) {
                var methods = allMethods.reduce((__methods, method) => {
                    var payload = allPayloads.find((x) => x.name === method.name);
                    if (payload) {
                        var fields = (0, index_js_1.getFieldsMetadata)(payload.dto);
                        if (Array.isArray(fields)) {
                            __methods[method.name] = {
                                payload: fields.reduce((__fields, field) => {
                                    __fields[field.name] = field.schema.type;
                                    return __fields;
                                }, {}),
                            };
                        }
                    }
                    return __methods;
                }, {});
                //@ts-ignore
                __handlers[handleMetadata.name] = methods;
            }
            return __handlers;
        }, {});
        map.handlers = handlers;
        fs_1.default.writeFileSync(path_1.default.resolve(process.cwd(), "opposer-map.json"), JSON.stringify(map, null, 2));
    }
}
async function Playgroud() {
    console.log("Gerando mapa da aplicação.");
    await generateMap();
    console.log("Inicializando playground.");
    const client = express_1.default.Router();
    var root = process.cwd();
    const __client = path_1.default.join(__dirname, "./build/client");
    const __map = path_1.default.resolve(root, "opposer-map.json");
    if (!fs_1.default.existsSync(__map)) {
        throw new Error("[Playground] - Necessary generate map system in root path, for generate run 'npx opposer system generate-map'.");
    }
    if (!fs_1.default.existsSync(__client)) {
        fs_1.default.mkdirSync(__client);
    }
    //copy map for public folder
    fs_1.default.copyFileSync(__map, path_1.default.resolve(__client, "opposer-map.json"));
    console.log(__client);
    client.use("/data/", express_1.default.static(__client));
    client.get("/playground*", (req, res) => {
        res.sendFile(path_1.default.join(__client, "index.html"));
    });
    return client;
}
