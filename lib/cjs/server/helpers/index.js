"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Success = Success;
exports.Exception = Exception;
exports.validateData = validateData;
const index_js_1 = require("../../orm/index.js");
function Success(data) {
    return {
        success: true,
        data,
    };
}
function Exception(error) {
    return {
        success: false,
        error: error,
    };
}
/**
 * Validates data against a model (Entity or DTO) decorated with @Field
 */
function validateData(model, values) {
    const errors = {};
    // Get fields from MetadataStore (supports both legacy and new ORM decorators)
    const fields = index_js_1.MetadataStore.getFields(model);
    for (const field of fields) {
        const value = values[field.name || field.propertyKey];
        if (field.validation) {
            const validator = typeof field.validation === 'function' ? field.validation() : field.validation;
            if (validator && typeof validator.validate === 'function') {
                const fieldErrors = validator.validate(value, values);
                if (fieldErrors && fieldErrors.length > 0) {
                    errors[field.name || field.propertyKey] = fieldErrors;
                }
            }
        }
    }
    return errors;
}
