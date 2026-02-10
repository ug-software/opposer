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
            message: "Unabled find schema",
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
    //valida se todas as propriedades que existem na data existem no repository
    var repositoryColumns = repository.metadata.columns;
    var thereIsPropertyOutsideTheRule = Object.keys(props.data).map((key) => {
        if (!repositoryColumns.find((x) => x.propertyName == key)) {
            return true;
        }
        return false;
    });
    if (thereIsPropertyOutsideTheRule.includes(true)) {
        return Exception({
            name: HttpStatus[400].name,
            code: HttpStatus[400].code,
            message: "'Data' out of expected range, check your data and try again",
        });
    }
    const query = queryTool.renderFilter(props.filter);
    if (!query) {
        return Exception({
            ...HttpStatus[400],
            message: "necessary pass query filter for update items.",
        });
    }
    await repository.update(query, props.data);
    return Success({
        message: "Success updating item",
    });
};
