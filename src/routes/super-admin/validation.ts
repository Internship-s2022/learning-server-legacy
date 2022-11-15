import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { SuperAdminType } from 'src/models/super-admin';

const superAdminValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<SuperAdminType>({
    email: Joi.string()
      .pattern(/^\w+([.-]?\w+)*@radiumrocket.com$/)
      .messages({
        'string.pattern.base': 'Longer possible email is 64 characters + @ + 255 characters.',
      }),
    password: Joi.string()
      .min(8)
      .max(50)
      .pattern(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?!.*[^a-zA-Z0-9])/)
      .messages({
        'string.min': 'Invalid password, it must contain at least 8 characters.',
        'string.max': 'Invalid password, it must not contain more than 50 characters.',
        'string.pattern.base': 'Invalid password, it must contain both letters and numbers.',
      }),
    firstName: Joi.string()
      .min(3)
      .max(50)
      .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
      .required()
      .messages({
        'string.min': 'Invalid name, it must contain more than 3 letters.',
        'string.max': 'Invalid name, it must not contain more than 50 letters.',
        'string.pattern.base': 'Invalid name, it must contain only letters.',
        'any.required': 'First Name is a required field.',
      }),
    lastName: Joi.string()
      .min(3)
      .max(50)
      .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
      .required()
      .messages({
        'string.min': 'Invalid last name, it must contain more than 3 letters.',
        'string.max': 'Invalid last name, it must not contain more than 50 letters.',
        'string.pattern.base': 'Invalid last name, it must contain only letters.',
        'any.required': 'Last Name is a required field.',
      }),
    isActive: Joi.boolean().optional(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default {
  superAdminValidation,
};
