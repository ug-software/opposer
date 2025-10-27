"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../helpers/index.js");
const index_js_2 = require("../constants/index.js");
const system = __importStar(require("../../system/index.js"));
const index_js_3 = require("../database/index.js");
exports.default = async (props) => {
    var schema = (await system.getAllSchemas()).find((x) => x.name === props.schema);
    if (!schema) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: "Unable to identify Schema.",
        });
    }
    if (!index_js_3.db) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: "Unable to connect for db.",
        });
    }
    var repository = index_js_3.db.getRepository(schema.entity);
    if (props.query.type === "filter") {
        //@ts-ignore
        var queryBuilder = {};
        if (props.query.join) {
            var relations = props.query.join.map((x) => x.schema);
            queryBuilder.relations = relations;
        }
        if (props.pagination) {
            var skip = 0;
            if (!props.pagination.take || props.pagination.take === 0) {
                props.pagination.take = 10;
            }
            if (props.pagination.page) {
                skip = props.pagination.page * props.pagination.take;
            }
            queryBuilder = {
                take: props.pagination.take,
                skip,
            };
        }
        if (!props.query.filter) {
            return (0, index_js_1.Exception)({
                name: index_js_2.HttpStatus[400].name,
                code: index_js_2.HttpStatus[400].code,
                message: "Search not understood, missing 'filter' parameter",
            });
        }
        if (props.query.select) {
            queryBuilder.select = props.query.select;
        }
        var resultFilter = await repository.find({
            where: props.query.filter,
            ...queryBuilder,
        });
        if (props.pagination) {
            var totalItems = await repository.count({
                where: props.query.filter,
                ...queryBuilder,
            });
            var totalPages = Math.floor(totalItems / props.pagination.take);
            return (0, index_js_1.Success)({
                items: resultFilter,
                totalItems,
                totalPages: totalPages > 0 ? totalPages : 0,
            });
        }
        return (0, index_js_1.Success)(resultFilter);
    }
    if (props.query.type === "find") {
        //@ts-ignore
        var queryBuilder = {};
        if (props.query.join) {
            var relations = props.query.join.map((x) => x.schema);
            queryBuilder.relations = relations;
        }
        if (!props.query.find) {
            return (0, index_js_1.Exception)({
                name: index_js_2.HttpStatus[400].name,
                code: index_js_2.HttpStatus[400].code,
                message: "Search not understood, missing 'find' parameter.",
            });
        }
        if (props.query.select) {
            queryBuilder.select = props.query.select;
        }
        var resultFind = await repository.findOne({
            where: props.query.find,
            ...queryBuilder,
        });
        return (0, index_js_1.Success)(resultFind);
    }
    return (0, index_js_1.Exception)({
        name: index_js_2.HttpStatus[400].name,
        code: index_js_2.HttpStatus[400].code,
        message: "Search not understood",
    });
};
