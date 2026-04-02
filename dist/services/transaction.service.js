"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/errors/AppError");
const auditService = __importStar(require("./audit.service"));
const createTransaction = async (userId, data) => {
    const transaction = await prisma_1.prisma.transaction.create({
        data: {
            ...data,
            userId,
            date: data.date ? new Date(data.date) : new Date(),
        },
    });
    // Asynchronous Audit Tracing
    auditService.logAction('CREATE', 'Transaction', transaction.id, userId, null, transaction).catch(console.error);
    return transaction;
};
exports.createTransaction = createTransaction;
const getTransactions = async (query) => {
    const { page = 1, limit = 10, type, category, startDate, endDate } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    // Ensure soft deleted records are always hidden naturally
    const where = { deletedAt: null };
    if (type)
        where.type = type;
    if (category)
        where.category = category;
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = new Date(startDate);
        if (endDate)
            where.date.lte = new Date(endDate);
    }
    // Execute database count and fetch concurrently
    const [transactions, totalCount] = await Promise.all([
        prisma_1.prisma.transaction.findMany({
            where,
            skip,
            take,
            orderBy: { date: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } } // Identify Author
            }
        }),
        prisma_1.prisma.transaction.count({ where }),
    ]);
    return {
        data: transactions,
        pagination: {
            total: totalCount,
            page: Number(page),
            limit: take,
            totalPages: Math.ceil(totalCount / take),
        },
    };
};
exports.getTransactions = getTransactions;
const getTransactionById = async (id) => {
    const transaction = await prisma_1.prisma.transaction.findFirst({
        where: { id, deletedAt: null },
        include: {
            user: { select: { id: true, name: true, email: true } }
        }
    });
    if (!transaction)
        throw new AppError_1.AppError('Transaction not found', 404);
    return transaction;
};
exports.getTransactionById = getTransactionById;
const updateTransaction = async (id, data, requestedByUserId) => {
    const transaction = await prisma_1.prisma.transaction.findFirst({ where: { id, deletedAt: null } });
    if (!transaction)
        throw new AppError_1.AppError('Transaction not found', 404);
    const updatedTransaction = await prisma_1.prisma.transaction.update({
        where: { id },
        data: { ...data },
    });
    auditService.logAction('UPDATE', 'Transaction', id, requestedByUserId, transaction, updatedTransaction).catch(console.error);
    return updatedTransaction;
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (id, requestedByUserId) => {
    const transaction = await prisma_1.prisma.transaction.findFirst({ where: { id, deletedAt: null } });
    if (!transaction)
        throw new AppError_1.AppError('Transaction not found', 404);
    // Soft deletion update
    const deletedTransaction = await prisma_1.prisma.transaction.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
    auditService.logAction('DELETE', 'Transaction', id, requestedByUserId, transaction, { deletedAt: deletedTransaction.deletedAt }).catch(console.error);
    return deletedTransaction;
};
exports.deleteTransaction = deleteTransaction;
