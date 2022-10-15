import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { UserType } from 'src/models/user';

const userValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<UserType>({
    firebaseUid: Joi.string().required(),
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
