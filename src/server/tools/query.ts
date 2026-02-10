import { QueryBuilder, RelationBuilder } from "../../interfaces/controller.js";
import {
  Or,
  Like,
  ILike,
  In,
  Not,
  Between,
  MoreThan,
  MoreThanOrEqual,
  Equal,
  LessThan,
  LessThanOrEqual,
} from "typeorm";

export default class QueryTool {
  renderFilter(query: QueryBuilder) {
    if (typeof query !== "object" && query === null) {
      return query;
    }

    var __query: Record<string, any> = {};

    for (const [key, value] of Object.entries(query)) {
      if (typeof value !== "object" && value === null) {
        __query[key] = value;
        continue;
      }

      // if 'or' value abort another query...
      if (key === "$or" && Array.isArray(value)) {
        __query = value.map((v) => this.renderFilter(v));
        return;
      }

      if (key.startsWith("$")) {
        switch (key) {
          case "$l":
            __query[key] = Like(value);
            break;

          case "$il":
            __query[key] = ILike(value);
            break;

          case "$in":
            __query[key] = In(value as Array<string | Date | number>);
            break;

          case "$nin":
            __query[key] = Not(In(value as Array<string | Date | number>));
            break;

          case "$btw":
            if (!Array.isArray(value)) {
              throw new Error(
                "[database] - for using between in query necessary value is Array."
              );
            }

            var [first, second] = value;
            __query[key] = Between(first, second);
            break;

          case "$mt":
            __query[key] = MoreThan(value);
            break;

          case "$mte":
            __query[key] = MoreThanOrEqual(value);
            break;

          case "$lt":
            __query[key] = LessThan(value);
            break;

          case "$lte":
            __query[key] = LessThanOrEqual(value);
            break;

          case "$eq":
            __query[key] = Equal(value);
            break;

          default:
            __query[key] = value;
        }

        continue;
      }

      if (typeof value !== "object") {
        __query[key] = value;
        continue;
      }

      if (value instanceof Date) {
        __query[key] = value;
        continue;
      }

      __query[key] = this.renderFilter(value as QueryBuilder);
    }

    return __query;
  }

  renderRelations(relations: (string | RelationBuilder)[] | string) {
    var __relation: { [key: string]: any } = {};

    if (typeof relations === "string") {
      return {
        [relations]: true,
      };
    }

    if (Array.isArray(relations)) {
      relations.forEach((relation) => {
        if (typeof relation === "string") {
          __relation[relation] = true;
        } else {
          __relation[relation.model] = this.renderRelations(relation.select);
        }
      });
    }

    return __relation;
  }

  renderSelect(select: string[] | string) {
    var __obj: { [key: string]: any } = {};

    if (typeof select === "string") {
      __obj[select] = true;
    }

    if (Array.isArray(select)) {
      select.forEach((field) => {
        __obj[field] = true;
      });
    }

    return __obj;
  }
}
