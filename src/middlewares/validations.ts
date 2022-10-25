import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';
const validateMongoID = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    throw new CustomError(400, 'Missing mongo id parameter');
  }
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    throw new CustomError(400, `The mongo id: ${req.params.id} is not valid`);
  }
  return next();
};

const validateFirebaseUid = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.uid) {
    throw new CustomError(400, 'Missing firebase uid parameter');
  }

  const uid = Joi.string().min(28).max(36).messages({
    'string.min': 'The firebase uid is not valid 28 characters min',
    'string.max': 'The firebase uid is not valid 36 characters max',
  });

  const validation = uid.validate(req.params.uid);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default {
  validateMongoID,
  validateFirebaseUid,
};
