"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../utils/errors/AppError");
// Throttling configuration
const MAX_LOGIN_ATTEMPTS = 20;
const LOCKOUT_MINUTES = 5;
const registerUser = async (data) => {
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new AppError_1.AppError('Email is already commonly used', 400);
    }
    const hashedPassword = await (0, password_1.hashPassword)(data.password);
    const user = await prisma_1.prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            role: data.role || 'VIEWER' // Default as requested in design
        }
    });
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    // Omit password from output for security
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    // 1. Check if the account is administratively locked or temporarily rate-limited
    if (user.isLocked) {
        throw new AppError_1.AppError('Account has been locked by Administrator.', 403);
    }
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        throw new AppError_1.AppError(`Account is temporarily locked. Please try again after 5 minutes.`, 403);
    }
    // 2. Validate password
    const isPasswordValid = await (0, password_1.comparePassword)(data.password, user.password);
    if (!isPasswordValid) {
        // 3. Brute Force Handling: Track failures
        const attempts = user.failedLoginAttempts + 1;
        const updates = { failedLoginAttempts: attempts };
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            const lockoutDate = new Date();
            lockoutDate.setMinutes(lockoutDate.getMinutes() + LOCKOUT_MINUTES);
            updates.lockoutUntil = lockoutDate;
        }
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: updates
        });
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    // 4. Login Successful: Reset counters
    if (user.failedLoginAttempts > 0 || user.lockoutUntil !== null) {
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
            }
        });
    }
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.loginUser = loginUser;
