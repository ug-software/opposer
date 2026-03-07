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
    try {
        const customModels = index_js_4.default.getContext("models");
        const allModels = await index_js_3.default.getAllModels(customModels);
        const schema = allModels.find((x) => x.name === props.model);
        if (!schema) {
            return (0, index_js_1.Exception)({
                name: index_js_2.HttpStatus[400].name,
                code: index_js_2.HttpStatus[400].code,
                message: "Unable to identify Schema",
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
        if (typeof props.data !== "object") {
            return (0, index_js_1.Exception)({
                name: index_js_2.HttpStatus[400].name,
                code: index_js_2.HttpStatus[400].code,
                message: "'Data' is not of type 'object'.",
            });
        }
        const repositoryFields = repository.Fields.map(f => f.name);
        const checkDataProperties = (data) => {
            return Object.keys(data).every(key => repositoryFields.includes(key) || key === 'id');
        };
        if (Array.isArray(props.data)) {
            for (const item of props.data) {
                if (!checkDataProperties(item)) {
                    return (0, index_js_1.Exception)({
                        name: index_js_2.HttpStatus[400].name,
                        code: index_js_2.HttpStatus[400].code,
                        message: "Some data properties are outside the expected range.",
                    });
                }
            }
            const results = await Promise.all(props.data.map(item => repository.insert(item)));
            return (0, index_js_1.Success)(results);
        }
        else {
            if (!checkDataProperties(props.data)) {
                return (0, index_js_1.Exception)({
                    name: index_js_2.HttpStatus[400].name,
                    code: index_js_2.HttpStatus[400].code,
                    message: "'Data' outside of expected range.",
                });
            }
            const result = await repository.insert(props.data);
            return (0, index_js_1.Success)(result);
        }
    }
    catch (err) {
        return (0, index_js_1.Exception)({
            name: index_js_2.HttpStatus[500].name,
            code: index_js_2.HttpStatus[500].code,
            message: err.message,
        });
    }
};
