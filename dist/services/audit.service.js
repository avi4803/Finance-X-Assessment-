"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.logAction = void 0;
const prisma_1 = require("../config/prisma");
const logAction = async (action, tableName, recordId, changedByUserId, oldData, newData) => {
    // Fire-and-Forget database insertion to not block the main process.
    // In an enterprise app, this might be sent to an SQS Queue or a worker.
    return await prisma_1.prisma.auditLog.create({
        data: {
            action,
            tableName,
            recordId,
            changedByUserId,
            oldData: oldData ? JSON.stringify(oldData) : null,
            newData: newData ? JSON.stringify(newData) : null,
        },
    });
};
exports.logAction = logAction;
const getAuditLogs = async (query) => {
    const { page = 1, limit = 20, tableName, action, recordId } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const where = {};
    if (tableName)
        where.tableName = tableName;
    if (action)
        where.action = action;
    if (recordId)
        where.recordId = recordId;
    const [logs, totalCount] = await Promise.all([
        prisma_1.prisma.auditLog.findMany({
            where,
            skip,
            take,
            orderBy: { timestamp: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma_1.prisma.auditLog.count({ where }),
    ]);
    return {
        data: logs,
        pagination: {
            total: totalCount,
            page: Number(page),
            limit: take,
            totalPages: Math.ceil(totalCount / take),
        },
    };
};
exports.getAuditLogs = getAuditLogs;
