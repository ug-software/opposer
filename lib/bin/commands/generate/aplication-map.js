import fs from "fs";
import path from "path";
import { getFieldsMetadata } from "../../../server/decorators/field.js";
import { getMethodMetadata } from "../../../server/decorators/method.js";
import { getPayloadMetadata } from "../../../server/decorators/payload.js";
import * as system from "../../../system/index.js";

export const command = "generate application-map";
export const desc = "Generate application map for opposer playground.";

export const builder = {};

export const handler = async () => {
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
        __handlers[handler.name] = methods;
      }

      return __handlers;
    }, {});

    map.handlers = handlers;

    fs.writeFileSync(
      path.resolve(process.cwd(), "opposer-map.json"),
      JSON.stringify(map, null, 2)
    );
  }
};
