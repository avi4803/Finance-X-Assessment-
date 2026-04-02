import { Response } from 'express';

export const sendError = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};
