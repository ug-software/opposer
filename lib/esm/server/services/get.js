import { Exception, Success } from "../helpers/index.js";
import { HttpStatus } from "../constants/index.js";
import * as system from "../../system/index.js";
import { db } from "../database/index.js";
import QueryTool from "../tools/query.js";
export default async (props) => {
    var queryTool = new QueryTool();
    var schema = (await system.getAllModels()).find((x) => x.name === props.model);
    if (!schema) {
        return Exception({
            name: HttpStatus[400].name,
            code: HttpStatus[400].code,
            message: "Unable to identify Schema.",
        });
    }
    if (!db) {
        return Exception({
            name: HttpStatus[400].name,
            code: HttpStatus[400].code,
            message: "Unable to connect for db.",
        });
    }
    var repository = db.getRepository(schema.entity);
    if (props.query.type === "filter") {
        //@ts-ignore
        var queryBuilder = {};
        if (props.query.relation) {
            queryBuilder.relations = queryTool.renderRelations(props.query.relation);
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
            return Exception({
                name: HttpStatus[400].name,
                code: HttpStatus[400].code,
                message: "Search not understood, missing 'filter' parameter",
            });
        }
        if (props.query.select) {
            queryBuilder.select = queryTool.renderSelect(props.query.select);
        }
        var resultFilter = await repository.find({
            where: queryTool.renderFilter(props.query.filter),
            ...queryBuilder,
        });
        if (props.pagination) {
            var totalItems = await repository.count({
                where: props.query.filter,
                ...queryBuilder,
            });
            var totalPages = Math.floor(totalItems / props.pagination.take);
            return Success({
                items: resultFilter,
                totalItems,
                totalPages: totalPages > 0 ? totalPages : 0,
            });
        }
        return Success(resultFilter);
    }
    if (props.query.type === "find") {
        //@ts-ignore
        var queryBuilder = {};
        if (props.query.relation) {
            queryBuilder.relations = queryTool.renderRelations(props.query.relation);
        }
        if (!props.query.find) {
            return Exception({
                name: HttpStatus[400].name,
                code: HttpStatus[400].code,
                message: "Search not understood, missing 'find' parameter.",
            });
        }
        if (props.query.select) {
            queryBuilder.select = queryTool.renderSelect(props.query.select);
        }
        var resultFind = await repository.findOne({
            where: queryTool.renderFilter(props.query.find),
            ...queryBuilder,
        });
        return Success(resultFind);
    }
    return Exception({
        name: HttpStatus[400].name,
        code: HttpStatus[400].code,
        message: "Search not understood",
    });
};
