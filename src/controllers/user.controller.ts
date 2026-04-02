import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess } from '../utils/errors/success.response';

// Admin Only: Fetch all users currently in the system
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUsers(req.query);
    return sendSuccess(res, result.data, 'Users retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

// Admin Only: Modify user status, role, or lock status
export const modifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUserByAdmin(req.params.id as string, req.body);
    return sendSuccess(res, result, 'User updated successfully by Administrator', 200);
  } catch (error) {
    next(error);
  }
};

// Admin Only: Permanently delete a user and all their associated records
export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUserByAdmin(req.params.id as string);
    return sendSuccess(res, null, 'User permanently deleted from system', 200);
  } catch (error) {
    next(error);
  }
};
