import { Like, ILike, In, Not, Between, MoreThan, MoreThanOrEqual, Equal, LessThan, LessThanOrEqual, } from "typeorm";
export default class QueryTool {
    renderFilter(query) {
        var __query = {};
        Object.keys(query).forEach((key) => {
            if (typeof query[key] !== "object") {
                __query[key] = query[key];
            }
            else {
                if (key === "$or") {
                    return query[key];
                }
                var __part = {};
                Object.entries(query[key]).forEach(([_key, value]) => {
                    switch (_key) {
                        case "$l":
                            __part = Like(value);
                            break;
                        case "$il":
                            __part = ILike(value);
                            break;
                        case "$in":
                            __part = In(value);
                            break;
                        case "$nin":
                            __part = Not(In(value));
                            break;
                        case "$btw":
                            if (!Array.isArray(value)) {
                                throw new Error("[database] - for using between in query necessary value is Array.");
                            }
                            var [first, second] = value;
                            __part = Between(first, second);
                            break;
                        case "$mt":
                            __part = MoreThan(value);
                            break;
                        case "$mte":
                            __part = MoreThanOrEqual(value);
                            break;
                        case "$lt":
                            __part = LessThan(value);
                            break;
                        case "$lte":
                            __part = LessThanOrEqual(value);
                            break;
                        case "$eq":
                            __part = Equal(value);
                            break;
                        default:
                            __part[_key] = value;
                    }
                });
                __query[key] = __part;
            }
        });
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
