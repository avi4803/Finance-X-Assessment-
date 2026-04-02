"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../utils/errors/AppError");
const prisma_1 = require("../config/prisma");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.AppError('Authentication required. Missing Bearer token.', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        // Check if user still exists (data integrity check)
        const currentUser = await prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!currentUser) {
            throw new AppError_1.AppError('The user belonging to this token no longer exists.', 401);
        }
        if (currentUser.status === 'INACTIVE') {
            throw new AppError_1.AppError('This account has been deactivated.', 403);
        }
        // Attach user to request
        req.user = currentUser;
        next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            next(error);
        }
        else {
            next(new AppError_1.AppError('Invalid or expired token', 401));
        }
    }
};
exports.authenticate = authenticate;
