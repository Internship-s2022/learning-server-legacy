import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';

const superAdminValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firebaseUid: Joi.string().required(),
    firstName: Joi.string()
      .min(3)
      .max(50)
      .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
      .required()
      .messages({
        'string.min': 'Invalid name, it must contain more than 3 letters',
        'string.max': 'Invalid name, it must not contain more than 50 letters',
        'string.pattern.base': 'Invalid name, it must contain only letters',
        'any.required': 'First Name is a required field',
      }),
    lastName: Joi.string()
      .min(3)
      .max(50)
      .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
      .required()
      .messages({
        'string.min': 'Invalid last name, it must contain more than 3 letters',
        'string.max': 'Invalid last name, it must not contain more than 50 letters',
        'string.pattern.base': 'Invalid last name, it must contain only letters',
        'any.required': 'Last Name is a required field',
      }),
    email: Joi.string()
      .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
      .required()
      .messages({
        'string.pattern.base': 'invalid email format',
        'any.required': 'Email is a required field',
      }),
    isActive: Joi.boolean().required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message, undefined);
  }
  return next();
};

export default {
  superAdminValidation,
};
