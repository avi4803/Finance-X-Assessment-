"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const AppError_1 = require("../utils/errors/AppError");
/**
 * Restrict access to strictly allowed roles
 * Example usage: authorizeRoles('ADMIN', 'ANALYST')
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new AppError_1.AppError('Unauthorized access', 401));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError_1.AppError('Forbidden: You do not have permission to access this resource', 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
