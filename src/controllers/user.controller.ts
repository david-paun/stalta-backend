import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { errorMessage } from '../utils/http-responses/error.js';
import { successMessage } from '../utils/http-responses/success.js';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find();
    return next(successMessage(200, 'All Users.', { users: users }));
  } catch (error) {
    return next(errorMessage(500, 'Internal Server Error.'));
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorMessage(404, 'User not found.'));
    }
    return next(successMessage(200, 'User found.', { user: user }));
  } catch (error) {
    return next(errorMessage(500, 'Internal Server Error.'));
  }
};
