import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import {
  countryMessages,
  firstNameMessages,
  lastNameMessages,
} from 'src/constants/validation-messages';
import {
  dniValidation,
  emailValidation,
  namingRegex,
  phoneValidation,
  shortStringValidation,
} from 'src/middlewares/validations';
import { CustomError } from 'src/models/custom-error';
import { UserType } from 'src/models/user';

const now = Date.now();
const cutoffDateMax = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);
const cutoffDateMin = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100);

const userValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<UserType>({
    firebaseUid: Joi.string(),
    email: emailValidation,
    postulant: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid postulant id, ObjectId expected.',
        'any.required': 'Postulant id is a required field.',
      }),
    isInternal: Joi.boolean().required().messages({
      'any.required': 'Is internal is required.',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is require.',
    }),
    isNewUser: Joi.boolean().required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

const userManualValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: shortStringValidation(namingRegex).messages(firstNameMessages),
    lastName: shortStringValidation(namingRegex).messages(lastNameMessages),
    country: shortStringValidation().messages(countryMessages),
    phone: phoneValidation,
    email: emailValidation,
    dni: dniValidation,
    birthDate: Joi.date().max(cutoffDateMax).min(cutoffDateMin).required().messages({
      'date.max': 'You need to be more than 18 years old.',
      'date.min': 'You need to be less than 100 years old.',
      'any.required': 'Date is a required field.',
    }),
    postulant: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid postulant id, ObjectId expected.',
      }),
    isInternal: Joi.boolean().required().messages({
      'any.required': 'Is internal is required.',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is required.',
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
  userManualValidation,
};
