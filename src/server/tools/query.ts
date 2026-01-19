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
    var __query: { [key: string]: any } = {};

    Object.keys(query).forEach((key) => {
      if (typeof key !== "object") {
        __query[key] = query[key];
      } else {
        var __part: { [key: string]: any } = {};
        Object.entries(query[key]).forEach(([key, value]) => {
          switch (key) {
            case "$or":
              __part[key] = Or(value);
              break;

            case "$l":
              __part[key] = Like(value);
              break;

            case "$il":
              __part[key] = ILike(value);
              break;

            case "$in":
              __part[key] = In(value);
              break;

            case "$nin":
              __part[key] = Not(In(value));
              break;

            case "$btw":
              if (!Array.isArray(value)) {
                throw new Error(
                  "[database] - for using between in query necessary value is Array."
                );
              }

              var [first, second] = value;
              __part[key] = Between(first, second);
              break;

            case "$mt":
              __part[key] = MoreThan(value);
              break;

            case "$mte":
              __part[key] = MoreThanOrEqual(value);
              break;

            case "$lt":
              __part[key] = LessThan(value);
              break;

            case "$lte":
              __part[key] = LessThanOrEqual(value);
              break;

            case "$eq":
              __part[key] = Equal(value);
              break;
          }
        });

        __query[key] = __part;
      }
    });

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
