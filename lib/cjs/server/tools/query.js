"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class QueryTool {
    renderFilter(query) {
        var __query = {};
        Object.keys(query).forEach((key) => {
            if (typeof key !== "object") {
                __query[key] = query[key];
            }
            else {
                var __part = {};
                Object.entries(query[key]).forEach(([key, value]) => {
                    switch (key) {
                        case "$or":
                            __part[key] = (0, typeorm_1.Or)(value);
                            break;
                        case "$l":
                            __part[key] = (0, typeorm_1.Like)(value);
                            break;
                        case "$il":
                            __part[key] = (0, typeorm_1.ILike)(value);
                            break;
                        case "$in":
                            __part[key] = (0, typeorm_1.In)(value);
                            break;
                        case "$nin":
                            __part[key] = (0, typeorm_1.Not)((0, typeorm_1.In)(value));
                            break;
                        case "$btw":
                            if (!Array.isArray(value)) {
                                throw new Error("[database] - for using between in query necessary value is Array.");
                            }
                            var [first, second] = value;
                            __part[key] = (0, typeorm_1.Between)(first, second);
                            break;
                        case "$mt":
                            __part[key] = (0, typeorm_1.MoreThan)(value);
                            break;
                        case "$mte":
                            __part[key] = (0, typeorm_1.MoreThanOrEqual)(value);
                            break;
                        case "$lt":
                            __part[key] = (0, typeorm_1.LessThan)(value);
                            break;
                        case "$lte":
                            __part[key] = (0, typeorm_1.LessThanOrEqual)(value);
                            break;
                        case "$eq":
                            __part[key] = (0, typeorm_1.Equal)(value);
                            break;
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
exports.default = QueryTool;
