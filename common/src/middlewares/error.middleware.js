"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware_handler = void 0;
// Error
const errors_1 = require("../errors");
const errorMiddleware_handler = (err, req, res, next) => {
    if (err instanceof errors_1.BaseError) {
        return res.status(err.statusCode).json({ errors: err.serializeErrors() });
    }
    console.error(err);
    res.status(500).json({ errors: [{ message: 'Something went wrong' }] });
};
exports.errorMiddleware_handler = errorMiddleware_handler;
