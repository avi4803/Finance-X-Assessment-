import { Response } from 'express';

export const sendSuccess = (
  res: Response, 
  data: any, 
  message: string = 'Success', 
  statusCode: number = 200,
  pagination?: any
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination && { pagination })
  });
};
