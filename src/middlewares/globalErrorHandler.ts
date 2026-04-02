import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';
import { sendError } from '../utils/errors/error.response';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Catch custom expected errors and format cleanly
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Log unhandled raw errors for backend debugging
  console.error('UNHANDLED SERVER ERROR 💥', err);
  
  // Fallback pattern matching the "Predictable Error" design
  return sendError(res, 'Internal Server Error. Please contact admin.', 500);
};
