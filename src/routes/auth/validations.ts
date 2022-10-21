import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';

interface UpdateUserPasswordType {
  firebaseUid: string;
  newPassword: string;
}

const updatePasswordValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<UpdateUserPasswordType>({
    firebaseUid: Joi.string()
      .required()
      .messages({ 'any.required': 'firebaseUid is a required field' }),
    newPassword: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?!.*[^a-zA-Z0-9])/)
      .messages({
        'string.min': 'Invalid password, it must contain at least 8 characters',
        'string.pattern.base': 'Invalid password, it must contain both letters and numbers',
        'any.required': 'newPassword is a required field',
      }),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { updatePasswordValidation };
