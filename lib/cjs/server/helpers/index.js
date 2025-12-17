"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Success = Success;
exports.Exception = Exception;
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
