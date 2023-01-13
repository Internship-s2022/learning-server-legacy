import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { firstNameMessages, lastNameMessages } from 'src/constants/validation-messages';
import { namingRegex, shortStringValidation } from 'src/middlewares/validations';
import { CustomError } from 'src/models/custom-error';
import { SuperAdminType } from 'src/models/super-admin';

const superAdminValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<SuperAdminType>({
    email: Joi.string()
      .pattern(/^[0-9a-zA-Z]+(?:[.\-_!$+=#][0-9a-zA-Z]+)*@radiumrocket.com$/)
      .messages({
        'string.pattern.base': 'Invalid email format.',
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
    firstName: shortStringValidation(namingRegex).messages(firstNameMessages),
    lastName: shortStringValidation(namingRegex).messages(lastNameMessages),
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
