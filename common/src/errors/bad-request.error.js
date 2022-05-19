"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
// Error
const base_error_1 = require("./base.error");
class BadRequestError extends base_error_1.BaseError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message || 'Bad Request' }];
    }
}
exports.BadRequestError = BadRequestError;
