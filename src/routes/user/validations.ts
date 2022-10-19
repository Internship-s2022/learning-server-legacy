import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { UserType } from 'src/models/user';

const now = Date.now();
const cutoffDateMax = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);
const cutoffDateMin = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100);

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
      .max(24)
      .pattern(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?!.*[^a-zA-Z0-9])/)
      .messages({
        'string.min': 'Invalid password, it must contain at least 8 characters',
        'string.max': 'Invalid password, it must not contain more than 24 characters',
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

const userManualValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
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
    location: Joi.string().min(3).max(50).required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': 'Invalid phone, it must contain 10 numbers',
        'string.pattern.base': 'Invalid phone, it must contain only numbers',
        'any.required': 'phone is a required field',
      }),
    email: Joi.string()
      .required()
      .pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
      .messages({
        'string.pattern.base': 'Invalid email format',
      }),
    dni: Joi.string()
      .min(6)
      .max(9)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.min': 'Invalid dni, it must contain more than 6 numbers',
        'string.max': 'Invalid dni, it must not contain more than 8 numbers',
        'string.pattern.base': 'Invalid dni, it must contain only numbers',
        'any.required': 'Dni is a required field',
      }),
    birthDate: Joi.date().max(cutoffDateMax).min(cutoffDateMin).required().messages({
      'date.max': 'You need to be more than 18 years old',
      'date.min': 'You need to be less than 100 years old',
      'any.required': 'Date is a required field',
    }),
    postulantId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid postulant id, ObjectId expected',
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
  userManualValidation,
};
