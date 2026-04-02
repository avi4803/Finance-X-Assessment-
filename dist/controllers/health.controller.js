"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHealth = void 0;
const prisma_1 = require("../config/prisma");
const success_response_1 = require("../utils/errors/success.response");
const error_response_1 = require("../utils/errors/error.response");
const checkHealth = async (req, res) => {
    try {
        // 1. Check Database Connectivity
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        return (0, success_response_1.sendSuccess)(res, {
            status: 'UP',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            services: {
                database: 'CONNECTED',
                cache: 'LOCAL_MEMORY' // Placeholder identifying we are in local mode
            }
        }, 'System is healthy');
    }
    catch (error) {
        return (0, error_response_1.sendError)(res, 'System is degraded: Database connection failed', 503);
    }
};
exports.checkHealth = checkHealth;
