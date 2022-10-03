import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const validateMongoID = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    return res.status(400).json({
      message: 'Missing id parameter',
      data: undefined,
      error: true,
    });
  }
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).json({
      message: `The id: ${req.params.id} is not valid`,
      data: undefined,
      error: true,
    });
  }
  return next();
};

export default {
  validateMongoID,
};
