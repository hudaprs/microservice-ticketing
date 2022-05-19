"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
// Error
const base_error_1 = require("./base.error");
class NotFoundError extends base_error_1.BaseError {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message || 'Not Found' }];
    }
}
exports.NotFoundError = NotFoundError;
