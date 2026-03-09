"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../constants/index.js");
const index_js_2 = require("../helpers/index.js");
const index_js_3 = __importDefault(require("../../system/index.js"));
const index_js_4 = require("../index.js");
exports.default = async (props) => {
    const customModels = index_js_4.Context.get('models');
    const allModels = await index_js_3.default.getAllModels(customModels);
    const model = allModels.find((x) => x.name === props.model);
    const db = index_js_4.Context.get('db');
    if (!db) {
        return (0, index_js_2.Exception)({
            name: index_js_1.HttpStatus[500].name,
            code: index_js_1.HttpStatus[500].code,
            message: 'Database not connected.',
        });
    }
    if (model) {
        const repository = db.getRepository(model.entity);
        if (!props.filter || Object.keys(props.filter).length === 0) {
            return (0, index_js_2.Exception)({
                ...index_js_1.HttpStatus[400],
                message: 'Necessary to set query params for delete items.',
            });
        }
        try {
            await repository.delete(props.filter);
            return (0, index_js_2.Success)({
                message: 'Success removing item',
            });
        }
        catch (err) {
            return (0, index_js_2.Exception)({
                name: index_js_1.HttpStatus[500].name,
                code: index_js_1.HttpStatus[500].code,
                message: err.message,
            });
        }
    }
    return (0, index_js_2.Exception)({
        name: index_js_1.HttpStatus[400].name,
        code: index_js_1.HttpStatus[400].code,
        message: 'Unable to identify Model.',
    });
};
