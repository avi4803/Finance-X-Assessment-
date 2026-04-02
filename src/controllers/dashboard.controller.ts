import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendSuccess } from '../utils/errors/success.response';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analyticsData = await dashboardService.getAnalyticsSummary(req.query);
    return sendSuccess(res, analyticsData, 'Dashboard Analytics retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trends = await dashboardService.getTrends();
    return sendSuccess(res, trends, '7-day financial trends retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
