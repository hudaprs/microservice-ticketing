"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
// Error
const base_error_1 = require("./base.error");
class UnauthorizedError extends base_error_1.BaseError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message || 'Unauthorized' }];
    }
}
exports.UnauthorizedError = UnauthorizedError;
