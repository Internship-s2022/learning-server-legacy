import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';

const validateMongoId = (req: Request, res: Response, next: NextFunction) => {
  const entries = Object.entries(req.params);
  const idParams = entries.reduce<[string, boolean][]>((prev, [key, value]) => {
    if (key.toLowerCase().includes('id')) {
      prev.push([key, mongoose.Types.ObjectId.isValid(value)]);
    }
    return prev;
  }, []);
  if (!idParams.length) {
    throw new CustomError(400, 'Missing mongo id parameter.');
  }
  const invalidId = idParams.find((param) => param[1] === false);
  if (invalidId) {
    throw new CustomError(400, `Mongo id: ${invalidId[0]}  is not valid.`);
  }
  return next();
};

const validateDni = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.dni) {
    throw new CustomError(400, 'Missing dni parameter');
  }
  const dniValid = Joi.string()
    .min(6)
    .max(9)
    .pattern(/^[0-9]+$/);
  const validation = dniValid.validate(req.params.dni);

  if (validation.error) {
    throw new CustomError(400, `The dni: ${req.params.dni} is not valid`);
  }
  return next();
};

const validateFirebaseUid = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.uid) {
    throw new CustomError(400, 'Missing firebase uid parameter.');
  }

  const uid = Joi.string().min(28).max(36).messages({
    'string.min': 'The firebase uid is not valid 28 characters min.',
    'string.max': 'The firebase uid is not valid 36 characters max.',
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
  validateDni,
};
