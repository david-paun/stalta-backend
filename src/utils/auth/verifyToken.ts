import jwt from 'jsonwebtoken';
import { errorMessage } from '../http-responses/error.js';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;
  if (!token) {
    return next(errorMessage(401, "You're not authenticated."));
  }
  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined in environment variables');
  }
  jwt.verify(token, process.env.JWT_SECRET, (err: any, userData: any) => {
    if (err) {
      return next(errorMessage(403, 'Invalid token.'));
    }
    req.userData = userData;
    next();
  });
};
