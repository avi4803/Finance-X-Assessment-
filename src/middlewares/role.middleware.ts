import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/errors/AppError';

/**
 * Restrict access to strictly allowed roles
 * Example usage: authorizeRoles('ADMIN', 'ANALYST')
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Unauthorized access', 401));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not have permission to access this resource', 403));
    }
    
    next();
  };
};
