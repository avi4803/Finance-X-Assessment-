import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/errors/error.response';

export const validate = (schema: any) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const message = (error as ZodError).issues.map((e: any) => `${e.path.join('.').replace('body.', '')}: ${e.message}`).join(', ');
        return sendError(res, `Validation error: ${message}`, 400);
      }
      return sendError(res, 'Internal validation error', 500);
    }
  };
