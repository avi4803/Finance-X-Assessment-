import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be a positive number"),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(2, "Category is required"),
    date: z.string().datetime().optional().describe("ISO datetime string. Defaults to current time if omitted"),
    notes: z.string().optional(),
  }),
});

export const UpdateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(2).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid transaction ID format"),
  }),
});

export const GetTransactionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid transaction ID format"),
  }),
});
