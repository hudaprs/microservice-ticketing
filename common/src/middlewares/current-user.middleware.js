"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserMiddleware_me = void 0;
// JWT
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const currentUserMiddleware_me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Check if there's no JWT in cookie
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        return next();
    }
    try {
        const user = (yield jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY));
        req.currentUser = user;
    }
    finally {
        //
    }
    return next();
});
exports.currentUserMiddleware_me = currentUserMiddleware_me;
