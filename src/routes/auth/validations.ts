import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';

interface UpdateUserPasswordType {
  firebaseUid: string;
  newPassword: string;
  isNewUser: boolean;
}

const updatePasswordValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<UpdateUserPasswordType>({
    firebaseUid: Joi.string()
      .required()
      .messages({ 'any.required': 'firebaseUid is a required field' }),
    newPassword: Joi.string()
      .required()
      .min(8)
      .max(24)
      .pattern(/[a-z]{1,}/)
      .pattern(/[A-Z]{1,}/)
      .pattern(/[0-9]{1,}/)
      .messages({
        'string.min': 'Invalid password, it must contain at least 8 characters',
        'string.max': 'Invalid password, it must not contain more than 24 characters',
        'string.pattern.base':
          'Invalid password, it must contain an uppercase letter, a lowercase letter and a number',
        'any.required': 'newPassword is a required field',
      }),
    isNewUser: Joi.boolean().optional(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { updatePasswordValidation };
