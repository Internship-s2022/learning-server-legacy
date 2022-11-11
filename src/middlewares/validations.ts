import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';

const validateMongoId = (req: Request, res: Response, next: NextFunction) => {
  const entries = Object.entries(req.params);
  const idParams = entries
    .filter((entry) => entry[0].toLowerCase().includes('id'))
    .map((entry) => [entry[0], mongoose.Types.ObjectId.isValid(entry[1])]);
  if (!idParams.length) {
    throw new CustomError(400, 'Missing mongo id parameter');
  }
  const invalidId = idParams.find((param) => param[1] === false);
  if (invalidId) {
    throw new CustomError(400, `Mongo id: ${invalidId[0]}  is not valid`);
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
  validateMongoId,
  validateFirebaseUid,
};
