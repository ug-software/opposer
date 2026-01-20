"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Schema {
    isValid(values) {
        return Object.keys(this).reduce((acc, key) => {
            const value = values[key];
            var object = this;
            var erros = object[key].validate(value, this);
            if (Array.isArray(erros) && erros.length > 0) {
                acc[key] = erros;
            }
            return acc;
        }, {});
    }
}
exports.default = Schema;
