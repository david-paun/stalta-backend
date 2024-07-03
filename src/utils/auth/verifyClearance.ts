import jwt from 'jsonwebtoken';
import { errorMessage } from '../http-responses/error.js';
import { hasAdminClearance } from '../clearance/clearanceLevel.js';
import User, { UserDocument } from '../../models/User.js';
import { Request, Response, NextFunction } from 'express';

export const verifyUser = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: UserDocument | any = await User.findById(req.userData.id);
  if (!user) {
    return next(errorMessage(404, 'User not found.'));
  }
  const isAdmin = await hasAdminClearance(user);
  if (req.userData.id === req.params.id || isAdmin) {
    next();
  } else {
    return next(errorMessage(403, "You're not authorized."));
  }
};

export const verifyAdmin = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: UserDocument | any = await User.findById(req.userData.id);
  const isAdmin = await hasAdminClearance(user);
  if (isAdmin) {
    next();
  } else {
    return next(errorMessage(403, "You're not authorized."));
  }
};
