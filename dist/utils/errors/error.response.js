"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = void 0;
const sendError = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
};
exports.sendError = sendError;
