import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';

const admissionTest = (req: Request, res: Response, next: NextFunction) => {
  const admissionTest = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.min': 'Invalid admission test name, it must contain more than 3 letters',
      'string.max': 'Invalid admission test name, it must not contain more than 50 letters',
      'any.required': 'Name is a required field',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is a required field',
    }),
  });

  const validation = admissionTest.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { admissionTest };
