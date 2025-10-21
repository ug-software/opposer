import "reflect-metadata";

const REDUCER_KEY = Symbol("reducer");

export default function Reducer(name: string) {
  return function (constructor: Object) {
    Reflect.defineMetadata(REDUCER_KEY, { name }, constructor);
  };
}

export function getReducerMetadata(target: Object) {
  return Reflect.getMetadata(REDUCER_KEY, target) || [];
}
