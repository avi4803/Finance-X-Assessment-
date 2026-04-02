import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors/AppError';
import * as auditService from './audit.service';

export const createTransaction = async (userId: string, data: any) => {
  const transaction = await prisma.transaction.create({
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

export const getTransactions = async (query: any) => {
  const { page = 1, limit = 10, type, category, startDate, endDate, search } = query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Ensure soft deleted records are always hidden naturally
  const where: any = { 
    deletedAt: null,
    ...(type && { type }),
    ...(category && { category }),
    ...(startDate || endDate) && {
      date: {
        ...(startDate && { gte: new Date(startDate as string) }),
        ...(endDate && { lte: new Date(endDate as string) }),
      }
    },
    ...(search && {
      OR: [
        { notes: { contains: search } },
        { category: { contains: search } }
      ]
    })
  };

  // Execute database count and fetch concurrently
  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } } // Identify Author
      }
    }),
    prisma.transaction.count({ where }),
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

export const getTransactionById = async (id: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, deletedAt: null },
    include: {
        user: { select: { id: true, name: true, email: true } }
    }
  });

  if (!transaction) throw new AppError('Transaction not found', 404);
  return transaction;
};

export const updateTransaction = async (id: string, data: any, requestedByUserId: string) => {
  const transaction = await prisma.transaction.findFirst({ where: { id, deletedAt: null } });
  
  if (!transaction) throw new AppError('Transaction not found', 404);

  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data: { ...data },
  });

  auditService.logAction('UPDATE', 'Transaction', id, requestedByUserId, transaction, updatedTransaction).catch(console.error);

  return updatedTransaction;
};

export const deleteTransaction = async (id: string, requestedByUserId: string) => {
  const transaction = await prisma.transaction.findFirst({ where: { id, deletedAt: null } });
  
  if (!transaction) throw new AppError('Transaction not found', 404);

  // Soft deletion update
  const deletedTransaction = await prisma.transaction.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  auditService.logAction('DELETE', 'Transaction', id, requestedByUserId, transaction, { deletedAt: deletedTransaction.deletedAt }).catch(console.error);

  return deletedTransaction;
};
