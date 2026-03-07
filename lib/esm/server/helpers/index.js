import { MetadataStore } from "../../orm/index.js";
export function Success(data) {
    return {
        success: true,
        data,
    };
}
export function Exception(error) {
    return {
        success: false,
        error: error,
    };
}
/**
 * Validates data against a schema (Entity or DTO) decorated with @Field
 */
export function validateData(schema, values) {
    const errors = {};
    // Get fields from MetadataStore (supports both legacy and new ORM decorators)
    const fields = MetadataStore.getFields(schema);
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
