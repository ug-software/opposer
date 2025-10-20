import { ObjectType } from "typeorm";

export function generic<T>(): ObjectType<T> {
  return Object as ObjectType<T>;
}
