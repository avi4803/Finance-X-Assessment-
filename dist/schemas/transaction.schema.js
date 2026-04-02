"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransactionSchema = exports.UpdateTransactionSchema = exports.CreateTransactionSchema = void 0;
const zod_1 = require("zod");
exports.CreateTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive("Amount must be a positive number"),
        type: zod_1.z.enum(['INCOME', 'EXPENSE']),
        category: zod_1.z.string().min(2, "Category is required"),
        date: zod_1.z.string().datetime().optional().describe("ISO datetime string. Defaults to current time if omitted"),
        notes: zod_1.z.string().optional(),
    }),
});
exports.UpdateTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive().optional(),
        type: zod_1.z.enum(['INCOME', 'EXPENSE']).optional(),
        category: zod_1.z.string().min(2).optional(),
        date: zod_1.z.string().datetime().optional(),
        notes: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid transaction ID format"),
    }),
});
exports.GetTransactionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid transaction ID format"),
    }),
});
