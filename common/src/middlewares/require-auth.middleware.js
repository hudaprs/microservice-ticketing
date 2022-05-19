"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuthMiddleware_requireAuth = void 0;
// Error
const errors_1 = require("../errors");
const requireAuthMiddleware_requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new errors_1.UnauthorizedError();
    }
    next();
};
exports.requireAuthMiddleware_requireAuth = requireAuthMiddleware_requireAuth;
