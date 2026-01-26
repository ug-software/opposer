import { Exception, Success } from "..//helpers/index.js";
import { HttpStatus } from "../constants/index.js";
import * as system from "../../system/index.js";
import { db } from "..//database/index.js";
export default async (props) => {
    try {
        var schema = (await system.getAllModels()).find((x) => x.name === props.model);
        if (!schema) {
            return Exception({
                name: HttpStatus[400].name,
                code: HttpStatus[400].code,
                message: "Unable to identify Schema",
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
        if (typeof props.data !== "object") {
            return Exception({
                name: HttpStatus[400].name,
                code: HttpStatus[400].code,
                message: "'Data' is not of type 'object'.",
            });
        }
        //valida se todas as propriedades que existem na data existem no repository
        var repositoryColumns = [
            ...repository.metadata.columns,
            ...repository.metadata.relations,
        ];
        var thereIsPropertyOutsideTheRule = Object.keys(props.data).map((key) => {
            if (!repositoryColumns.find((x) => x.propertyName == key && x.propertyName !== "id")) {
                return true;
            }
            return false;
        });
        if (thereIsPropertyOutsideTheRule.includes(true)) {
            return Exception({
                name: HttpStatus[400].name,
                code: HttpStatus[400].code,
                message: "'Data' outside of expected range, check your data and try again.",
            });
        }
        if (Array.isArray(props.data)) {
            var items = props.data.map((x) => repository.create(x));
            await repository.insert(items);
            return Success(items);
        }
        const item = repository.create(props.data);
        await repository.insert(item);
        return Success(item);
    }
    catch (err) {
        var error = err;
        return Exception({
            name: HttpStatus[500].name,
            code: HttpStatus[500].code,
            message: error.message,
        });
    }
};
