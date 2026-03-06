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
    const schema = allModels.find((x) => x.name === props.model);
    if (!schema) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: "Unable to find schema",
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
    const repository = db.getRepository(schema.entity);
    const repositoryFields = repository.Fields.map(f => f.name);
    const thereIsPropertyOutsideTheRule = Object.keys(props.data).some((key) => {
        return !repositoryFields.includes(key) && key !== 'id';
    });
    if (thereIsPropertyOutsideTheRule) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[400].name,
            code: index_js_2.HttpStatus[400].code,
            message: "'Data' out of expected range, check your data and try again",
        });
    }
    if (!props.filter || Object.keys(props.filter).length === 0) {
        return (0, index_js_1.Exception)({
            ...index_js_2.HttpStatus[400],
            message: "Necessary to set query params for update items.",
        });
    }
    try {
        await repository.update(props.filter, props.data);
        return (0, index_js_1.Success)({
            message: "Success updating item",
        });
    }
    catch (err) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[500].name,
            code: index_js_2.HttpStatus[500].code,
            message: err.message,
        });
    }
};
