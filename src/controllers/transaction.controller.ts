import { Request, Response, NextFunction } from 'express';
import * as transactionService from '../services/transaction.service';
import { sendSuccess } from '../utils/errors/success.response';

export const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id; // From Auth Middleware
    const transaction = await transactionService.createTransaction(userId, req.body);
    return sendSuccess(res, transaction, 'Transaction created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await transactionService.getTransactions(req.query);
    return sendSuccess(res, result.data, 'Transactions retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id as string);
    return sendSuccess(res, transaction, 'Transaction retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const transaction = await transactionService.updateTransaction(req.params.id as string, req.body, userId);
    return sendSuccess(res, transaction, 'Transaction updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    await transactionService.deleteTransaction(req.params.id as string, userId);
    return sendSuccess(res, null, 'Transaction deleted successfully (Soft Data Retention)', 200);
  } catch (error) {
    next(error);
  }
};
