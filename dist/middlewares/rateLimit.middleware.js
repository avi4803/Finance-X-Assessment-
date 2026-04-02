"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Note: This is an In-Memory cache by default.
// In a high-traffic production scenario, we easily swap this with 'rate-limit-redis'
// if process.env.REDIS_URL is detected.
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // Limit each IP to 100 login requests per window
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
