import { ResultGetAllControllers } from "../../interfaces/controller.js";
import system from "../../system/index.js";
import * as decorator from "../decorators/index.js";
import { ClassType } from "../../interfaces/system.js";

const controllers: ResultGetAllControllers = {};

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

// function responsible per cache controllers in project;
export async function loadControllers(customControllers?: string | ClassType<unknown>[]): Promise<ResultGetAllControllers> {
  var __allControllers = await system.getAllControllers(customControllers);

  if (Array.isArray(__allControllers) && Object.keys(controllers).length === 0) {
    return __allControllers.reduce((controllers, controller) => {
      var controllerMetadata = decorator.getControllerMetadata(controller);
      var methodsMetadata = decorator.getMethodMetadata(controller);

      controllers[controllerMetadata.name] = {
        metadata: controllerMetadata,
        methods: Array.isArray(methodsMetadata) ? methodsMetadata : [],
        controller: controller,
      };

      return controllers;
    }, controllers);
  }

  return controllers;
}
