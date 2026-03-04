import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import system from "../system/index.js";
import {
  getMethodMetadata,
  getPayloadMetadata,
  getFieldsMetadata,
  getHandlerMetadata,
} from "../server/decorators/index.js";
import { MetadataStore } from "../orm/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMap(server?: any, modelsPath?: string, handlersPath?: string) {
  var map = {
    models: {},
    handlers: {},
  };

  var allModels = await system.getAllModels();
  const internalModels = ["usr", "rl", "se", "ke", "crp", "User", "Role", "Session", "Key", "ChangeRequestPassword"];

  if (Array.isArray(allModels)) {
    var models = allModels
      .filter(m => !internalModels.includes(m.name))
      .reduce((__models: any, model) => {
        var fields = getFieldsMetadata(model.entity);
        const meta = MetadataStore.getEntity(model.entity);

        if (Array.isArray(fields)) {
          var schema = fields.reduce((__schema: any, field: any) => {
            __schema[field.name] = field.schema?.type || "string";
            return __schema;
          }, {});

          __models[model.name] = {
            description: meta?.description || "Database Entity Definition",
            schema: schema
          };
        }

        return __models;
      }, {});

    map.models = models;
  }

  var allHandlers = await system.getAllHandlers(handlersPath);
  if (Array.isArray(allHandlers)) {
    var handlers = allHandlers.reduce((__handlers: any, handler) => {
      var handleMetadata = getHandlerMetadata(handler);
      var allMethods = getMethodMetadata(handler);
      var allPayloads = getPayloadMetadata(handler);

      if (Array.isArray(allMethods)) {
        var methods = allMethods.reduce((__methods: any, method) => {
          var payload = allPayloads.find(
            (x: { name: string }) => x.name === method.name
          );

          if (payload) {
            var fields = getFieldsMetadata(payload.dto);

            if (Array.isArray(fields)) {
              __methods[method.name] = {
                payload: fields.reduce((__fields: any, field: any) => {
                  __fields[field.name] = field.schema?.type || "string";
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

    map.handlers = handlers;

    const mapPath = path.resolve(process.cwd(), "opposer-map.json");
    fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
    return map;
  }
  return map;
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export default async function Playground(req: any, res: any, next: () => void) {
  const server = req.server;
  const modelsPath = server.getContext("modelsPath");
  const handlersPath = server.getContext("handlersPath");

  // Public map endpoint for the Swagger UI
  if (req.url === "/opposer-map.json") {
    const map = await generateMap(server, modelsPath, handlersPath);
    res.status(200).json(map);
    return;
  }

  // Base playground route - Serve static files from build/client
  if (req.url.startsWith("/playground")) {
    await generateMap(server, modelsPath, handlersPath);

    const buildPath = path.resolve(__dirname, "build", "client");
    let relativePath = req.url.replace("/playground", "");

    if (relativePath === "" || relativePath === "/") {
      relativePath = "/index.html";
    }

    let filePath = path.join(buildPath, relativePath);

    // If file doesn't exist, fallback to index.html only if it's a likely page request
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const isAsset = /\.(js|css|png|jpg|gif|svg|ico|json|map)$/.test(
        relativePath
      );
      if (!isAsset) {
        filePath = path.join(buildPath, "index.html");
      } else {
        res.status(404).json({ message: `Asset ${relativePath} not found.` });
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    try {
      console.log("filePath", filePath);
      const content = fs.readFileSync(filePath);
      res.setHeader("Content-Type", contentType);
      res.status(200).end(content);
    } catch (error) {
      res.status(500).json({ message: "Error serving playground file." });
    }
    return;
  }

  next();
}
