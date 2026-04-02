import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/errors/AppError';
import { prisma } from '../config/prisma';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Missing Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    // Check if user still exists (data integrity check)
    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!currentUser) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }
    
    if (currentUser.status === 'INACTIVE') {
      throw new AppError('This account has been deactivated.', 403);
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
};
