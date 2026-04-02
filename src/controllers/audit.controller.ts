import { Request, Response, NextFunction } from 'express';
import * as auditService from '../services/audit.service';
import { sendSuccess } from '../utils/errors/success.response';

export const getLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await auditService.getAuditLogs(req.query);
    return sendSuccess(res, result.data, 'Enterprise Audit Logs retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};
