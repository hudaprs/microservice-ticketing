"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
// Error
const base_error_1 = require("./base.error");
class ValidationError extends base_error_1.BaseError {
    constructor(errors) {
        super();
        this.errors = errors;
        this.statusCode = 422;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map(({ msg, param }) => ({
            message: msg,
            field: param
        }));
    }
}
exports.ValidationError = ValidationError;
