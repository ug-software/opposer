import { HandleRequestResultError } from "../../interfaces/request.js";
import { MetadataStore, FieldValidator } from "../../orm/index.js";

export function Success(data: any) {
  return {
    success: true,
    data,
  } as const;
}

export function Exception(error: HandleRequestResultError["error"]) {
  return {
    success: false,
    error: error,
  } as const;
}

/**
 * Validates data against a schema (Entity or DTO) decorated with @Field
 */
export function validateData(schema: any, values: Record<string, any>) {
  const errors: Record<string, string[]> = {};
  
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
