"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/errors/AppError");
const error_response_1 = require("../utils/errors/error.response");
const globalErrorHandler = (err, req, res, next) => {
    // Catch custom expected errors and format cleanly
    if (err instanceof AppError_1.AppError) {
        return (0, error_response_1.sendError)(res, err.message, err.statusCode);
    }
    // Log unhandled raw errors for backend debugging
    console.error('UNHANDLED SERVER ERROR 💥', err);
    // Fallback pattern matching the "Predictable Error" design
    return (0, error_response_1.sendError)(res, 'Internal Server Error. Please contact admin.', 500);
};
exports.globalErrorHandler = globalErrorHandler;
