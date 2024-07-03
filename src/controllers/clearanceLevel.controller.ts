import { Request, Response, NextFunction } from 'express';
import ClearanceLevel, {
  ClearanceLevelDocument,
} from '../models/ClearanceLevel.js'; // Import ClearanceLevelDocument if defined separately
import { errorMessage } from '../utils/http-responses/error.js';
import { successMessage } from '../utils/http-responses/success.js';

export const createClearanceLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.body.level && req.body.level !== '') {
      const newClearanceLevel = new ClearanceLevel({ level: req.body.level });
      await newClearanceLevel.save();
      return next(successMessage(200, 'Clearance Level Created.'));
    } else {
      return next(errorMessage(400, 'Bad Request.'));
    }
  } catch (error: any) {
    return next(errorMessage(500, 'Internal Server Error.', error.stack));
  }
};

export const updateClearanceLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clearanceLevel = await ClearanceLevel.findById(req.params.id);
    if (clearanceLevel) {
      const newData = await ClearanceLevel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return next(successMessage(200, 'Clearance Level updated!'));
    }
    return next(errorMessage(404, 'Clearance Level not found!'));
  } catch (error: any) {
    return next(errorMessage(500, 'Internal Server Error.', error.stack));
  }
};

export const getClearanceLevels = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clearanceLevels = await ClearanceLevel.find({});
    return next(
      successMessage(200, 'Clearance Levels sent.', { levels: clearanceLevels })
    );
  } catch (error: any) {
    return next(errorMessage(500, 'Internal Server Error.', error.stack));
  }
};

export const deleteClearanceLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clearanceLevelId = req.params.id;
    const clearanceLevel = await ClearanceLevel.findById(clearanceLevelId);
    if (clearanceLevel) {
      await ClearanceLevel.findByIdAndDelete(clearanceLevelId);
      return next(successMessage(200, 'Clearance Level Deleted!'));
    }
    return next(errorMessage(404, 'Clearance Level not found!'));
  } catch (error: any) {
    return next(errorMessage(500, 'Internal Server Error.', error.stack));
  }
};
