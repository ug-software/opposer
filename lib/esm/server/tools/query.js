import { Like, ILike, In, Not, Between, MoreThan, MoreThanOrEqual, Equal, LessThan, LessThanOrEqual, } from "typeorm";
export default class QueryTool {
    renderFilter(query) {
        if (typeof query !== "object" && query === null) {
            return null;
        }
        var __query = {};
        for (const [key, value] of Object.entries(query)) {
            if (typeof value !== "object" && value === null) {
                __query[key] = value;
                continue;
            }
            // if 'or' value abort another query...
            if (key === "$or" && Array.isArray(value)) {
                __query = value.map((v) => this.renderFilter(v));
                return __query;
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
                        __query[key] = In(value);
                        break;
                    case "$nin":
                        __query[key] = Not(In(value));
                        break;
                    case "$btw":
                        if (!Array.isArray(value)) {
                            throw new Error("[database] - for using between in query necessary value is Array.");
                        }
                        var [first, second] = value;
                        __query = Between(first, second);
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
            __query[key] = this.renderFilter(value);
        }
        return __query;
    }
    renderRelations(relations) {
        var __relation = {};
        if (typeof relations === "string") {
            return {
                [relations]: true,
            };
        }
        if (Array.isArray(relations)) {
            relations.forEach((relation) => {
                if (typeof relation === "string") {
                    __relation[relation] = true;
                }
                else {
                    __relation[relation.model] = this.renderRelations(relation.select);
                }
            });
        }
        return __relation;
    }
    renderSelect(select) {
        var __obj = {};
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
