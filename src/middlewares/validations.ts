import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';

const validateMongoID = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    throw new CustomError(400, 'Missing id parameter');
  }
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    throw new CustomError(400, `The id: ${req.params.id} is not valid`);
  }
  return next();
};

export default {
  validateMongoID,
};
