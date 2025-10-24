import _get from "../services/get.js";
import _insert from "../services/insert.js";
import _update from "../services/update.js";
import _delete from "../services/delete.js";
import { HttpStatus } from "../constants/index.js";
import * as system from "../system/index.js";
import { Field } from "../database/field.js";
export default async (req, res) => {
    var props = req.body;
    var schema = (await system.getAllSchemas()).find((x) => x.name === props.schema);
    if (!schema) {
        res.status(400).json({
            name: HttpStatus[400].name,
            code: HttpStatus[400].code,
            message: "Unable to identify Schema.",
        });
        return;
    }
    var erros = Field.validate(schema, props);
    if (Object.keys(erros).length > 0) {
        res.status(400).json({
            erros,
            message: "Data not valid for method, verify erros and try again.",
        });
        return;
    }
    var result = {
        success: false,
        error: {
            name: HttpStatus[400].name,
            code: HttpStatus[400].code,
            message: "Unable to identify Schema",
        },
    };
    if (!["get", "insert", "update", "delete"].includes(req.body.method)) {
        result.error.message = "It was not possible to identify the method used.";
    }
    switch (props.method) {
        case "get":
            var getBody = req.body;
            result = await _get(getBody);
            break;
        case "insert":
            var insertBody = req.body;
            result = await _insert(insertBody);
            break;
        case "update":
            var updateBody = req.body;
            result = await _update(updateBody);
            break;
        case "delete":
            var deleteBody = req.body;
            result = await _delete(deleteBody);
            break;
    }
    if (result.success) {
        res.status(HttpStatus[200].code).json(result.data);
        return;
    }
    //@ts-ignore
    res.status(result.error.code).json(result.error);
    return;
};
