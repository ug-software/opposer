import { ToolField } from "./field.js";

export default class Schema {
  isValid(values: any) {
    return Object.keys(this).reduce((acc, key) => {
      const value = values[key];

      var object = this as unknown as Record<string, ToolField>
      var erros = object[key].validate(value, this);
      if(Array.isArray(erros) && erros.length > 0){
        acc[key] = erros;

      }

      return acc;
    }, {} as Record<string, any>);
  }
}
