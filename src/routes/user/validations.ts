import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { UserType } from 'src/models/user';

const userValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<UserType>({
    firebaseUid: Joi.string(),
    email: Joi.string()
      .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
      .messages({
        'string.pattern.base': 'Invalid email format',
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?!.*[^a-zA-Z0-9])/)
      .messages({
        'string.min': 'Invalid password, it must contain at least 8 characters',
        'string.pattern.base': 'Invalid password, it must contain both letters and numbers',
      }),
    postulantId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid postulant id, ObjectId expected',
        'any.required': 'Postulant id is a required field',
      }),
    isInternal: Joi.boolean().required().messages({
      'any.required': 'Is internal is required',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is required',
    }),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default {
  userValidation,
};
