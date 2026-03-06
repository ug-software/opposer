"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../helpers/index.js");
const index_js_2 = require("../constants/index.js");
const index_js_3 = __importDefault(require("../../system/index.js"));
const index_js_4 = __importDefault(require("../core/index.js"));
exports.default = async (props) => {
    const allModels = await index_js_3.default.getAllModels();
    const schema = allModels.find((x) => {
        return x.name.toLowerCase() === props.model.toLowerCase();
    });
    if (!schema) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: "Unable to identify Schema.",
        });
    }
    const db = index_js_4.default.getContext("db");
    if (!db) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[500].name,
            code: index_js_2.HttpStatus[500].code,
            message: "Database not connected.",
        });
    }
    if (!props.query) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: "Search parameters missing.",
        });
    }
    const repository = db.getRepository(schema.entity);
    const queryKeys = [
        "filter",
        "find",
        "count",
        "exists",
        "aggregate",
        "distinct",
        "group",
    ];
    const presentKeys = queryKeys.filter((k) => {
        return k in props.query;
    });
    if (presentKeys.length > 1) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: `Conflicting search parameters: multiple types provided (${presentKeys.join(", ")}).`,
        });
    }
    let type = props.query.type;
    if (presentKeys.length === 1) {
        type = presentKeys[0];
    }
    if (!type) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: "Search type not identified. Please provide one of: " +
                queryKeys.join(", "),
        });
    }
    try {
        switch (type) {
            case "filter": {
                const filter = props.query.filter || {};
                const select = props.query.select || [];
                const pagination = props.pagination;
                const items = await repository.find({
                    where: filter,
                    select,
                    pagination,
                });
                if (props.pagination) {
                    const totalItems = await repository.count(filter);
                    const totalPages = Math.ceil(totalItems / (props.pagination.take || 10));
                    return (0, index_js_1.Success)({
                        items,
                        totalItems,
                        totalPages: totalPages > 0 ? totalPages : 0,
                    });
                }
                return (0, index_js_1.Success)(items);
            }
            case "find": {
                const find = props.query.find || {};
                const select = props.query.select || [];
                const result = await repository.findOne({
                    where: find,
                    select,
                });
                return (0, index_js_1.Success)(result);
            }
            case "count": {
                const count = props.query.count || {};
                const result = await repository.count(count);
                return (0, index_js_1.Success)({ count: result });
            }
            case "exists": {
                const exists = props.query.exists || {};
                const result = await repository.exists(exists);
                return (0, index_js_1.Success)({ exists: result });
            }
            case "aggregate": {
                const aggregate = props.query.aggregate;
                if (!aggregate) {
                    throw new Error("Aggregate configuration missing.");
                }
                const result = await repository.aggregate(aggregate);
                return (0, index_js_1.Success)(result);
            }
            case "distinct": {
                const distinct = props.query.distinct;
                if (!distinct) {
                    throw new Error("Distinct configuration missing.");
                }
                const result = await repository.distinct(distinct);
                return (0, index_js_1.Success)(result);
            }
            case "group": {
                const group = props.query.group;
                if (!group) {
                    throw new Error("Group configuration missing.");
                }
                const result = await repository.group(group);
                return (0, index_js_1.Success)(result);
            }
            default:
                return (0, index_js_1.Exception)({
                    name: index_js_2.HttpStatus[400].name,
                    code: index_js_2.HttpStatus[400].code,
                    message: `Search type '${type}' not understood.`,
                });
        }
    }
    catch (err) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: err.message,
        });
    }
};
