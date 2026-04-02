import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/errors/success.response';
import { sendError } from '../utils/errors/error.response';

export const checkHealth = async (req: Request, res: Response) => {
  try {
    // 1. Check Database Connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    return sendSuccess(res, {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: 'CONNECTED',
        cache: 'LOCAL_MEMORY' // Placeholder identifying we are in local mode
      }
    }, 'System is healthy');
    
  } catch (error) {
    return sendError(res, 'System is degraded: Database connection failed', 503);
  }
};
