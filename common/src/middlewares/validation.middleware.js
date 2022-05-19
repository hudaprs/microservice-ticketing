"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware_validate = void 0;
// Express Validator
const express_validator_1 = require("express-validator");
// Error
const errors_1 = require("../errors");
const validationMiddleware_validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        throw new errors_1.ValidationError(errors.array());
    next();
};
exports.validationMiddleware_validate = validationMiddleware_validate;
