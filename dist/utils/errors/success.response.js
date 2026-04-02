"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', statusCode = 200, pagination) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(pagination && { pagination })
    });
};
exports.sendSuccess = sendSuccess;
