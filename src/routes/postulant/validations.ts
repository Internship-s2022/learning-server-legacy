import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { PostulantType } from 'src/models/postulant';

const now = Date.now();
const cutoffDateMax = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);
const cutoffDateMin = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100);

const postulantValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<PostulantType>({
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
    location: Joi.string().min(3).max(50).required(),
    email: Joi.string()
      .required()
      .pattern(/^[0-9a-zA-Z]+(?:[.\-_!$+=#][0-9a-zA-Z]+)*@[a-z0-9]{2,252}(?:\.[a-z]{2,3})+$/s)
      .messages({
        'string.pattern.base': 'Invalid email format.',
        //TO-DO: try to implement diferent cases for pattern validation. It is not possible to make this at this moment. It will be investigated with another tecnologies.
      }),
    birthDate: Joi.date().max(cutoffDateMax).min(cutoffDateMin).required().messages({
      'date.max': 'You need to be older than 18 years old.',
      'date.min': 'You need to be younger than 100 years old.',
      'any.required': 'Date is a required field.',
    }),
    dni: Joi.string()
      .min(6)
      .max(9)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.min': 'Invalid dni, it must contain more than 6 numbers.',
        'string.max': 'Invalid dni, it must not contain more than 8 numbers.',
        'string.pattern.base': 'Invalid dni, it must contain only numbers.',
        'any.required': 'Dni is a required field.',
      }),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': 'Invalid phone, it must contain 10 numbers.',
        'string.pattern.base': 'Invalid phone, it must contain only numbers.',
        'any.required': 'phone is a required field.',
      }),
    isActive: Joi.boolean().required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default {
  postulantValidation,
};
