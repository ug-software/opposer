import { ResultGetAllHandlers } from "../../interfaces/controller.js";
import system from "../../system/index.js";
import * as decorator from "../decorators/index.js";

const handlers: ResultGetAllHandlers = {};

export function toKebabCase(str: string) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // adiciona hífen antes de maiúsculas
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // caso AAAa
    .toLowerCase();
}

export function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

// function responsible per cache handlers in project;
export async function loadHandlers(): Promise<ResultGetAllHandlers> {
  var __handlers = await system.getAllHandlers();

  if (Array.isArray(__handlers) && Object.keys(handlers).length === 0) {
    return __handlers.reduce((handlers, handler) => {
      var handlerMetadata = decorator.getHandlerMetadata(handler);
      var methodsMetadata = decorator.getMethodMetadata(handler);

      handlers[handlerMetadata.name] = {
        metadata: handlerMetadata,
        methods: Array.isArray(methodsMetadata) ? methodsMetadata : [],
        handler: handler,
      };

      return handlers;
    }, handlers);
  }

  return handlers;
}
