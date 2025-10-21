import { ResultGetAllReducers } from "../interfaces/reducers.js";
import * as system from "../system/index.js";
import * as decorator from "../decorators/index.js";

const reducers: ResultGetAllReducers = {};

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

// function responsible per cache reducers in project;
export async function loadReducers(): Promise<ResultGetAllReducers> {
  var __reducers = await system.getAllReducers();

  if (Array.isArray(__reducers) && Object.keys(reducers).length === 0) {
    return __reducers.reduce((reducers, reducer) => {
      var reducerMetadata = decorator.getReducerMetadata(reducer);
      var actionsMetadata = decorator.getActionsMetadata(reducer);

      reducers[reducerMetadata.name] = {
        reducer: reducerMetadata,
        actions: Array.isArray(actionsMetadata)
          ? actionsMetadata.map((a) => ({ name: toKebabCase(a.name) }))
          : [],
        handler: reducer,
      };

      return reducers;
    }, reducers);
  }

  return reducers;
}
