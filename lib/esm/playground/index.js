import express from "express";
import fs from "fs";
import path from "path";
import * as system from "../system/index.js";
import { getMethodMetadata, getPayloadMetadata, getFieldsMetadata, getHandlerMetadata, } from "../server/decorators/index.js";
async function generateMap() {
    var map = {
        models: {},
        handlers: {},
    };
    var allModels = await system.getAllModels();
    if (Array.isArray(allModels)) {
        var models = allModels.reduce((__models, model) => {
            var fields = getFieldsMetadata(model.entity);
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
            var handleMetadata = getHandlerMetadata(handler);
            var allMethods = getMethodMetadata(handler);
            var allPayloads = getPayloadMetadata(handler);
            if (Array.isArray(allMethods)) {
                var methods = allMethods.reduce((__methods, method) => {
                    var payload = allPayloads.find((x) => x.name === method.name);
                    if (payload) {
                        var fields = getFieldsMetadata(payload.dto);
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
        fs.writeFileSync(path.resolve(process.cwd(), "opposer-map.json"), JSON.stringify(map, null, 2));
    }
}
export default async function Playgroud() {
    console.log("Gerando mapa da aplicação.");
    await generateMap();
    console.log("Inicializando playground.");
    const client = express.Router();
    var root = process.cwd();
    const __client = path.join(__dirname, "./build/client");
    const __map = path.resolve(root, "opposer-map.json");
    if (!fs.existsSync(__map)) {
        throw new Error("[Playground] - Necessary generate map system in root path, for generate run 'npx opposer system generate-map'.");
    }
    if (!fs.existsSync(__client)) {
        fs.mkdirSync(__client);
    }
    //copy map for public folder
    fs.copyFileSync(__map, path.resolve(__client, "opposer-map.json"));
    console.log(__client);
    client.use("/data/", express.static(__client));
    client.get("/playground*", (req, res) => {
        res.sendFile(path.join(__client, "index.html"));
    });
    return client;
}
