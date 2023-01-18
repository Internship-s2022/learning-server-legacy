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
import { PostulantType } from 'src/models/postulant';

const now = Date.now();
const cutoffDateMax = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);
const cutoffDateMin = new Date(now - 1000 * 60 * 60 * 24 * 365 * 100);

const postulantValidation = (postulantInfo?: Record<string, unknown>) => {
  return (req: Request, res: Response, next?: NextFunction) => {
    const schema = Joi.object<PostulantType>({
      firstName: shortStringValidation(namingRegex).messages(firstNameMessages),
      lastName: shortStringValidation(namingRegex).messages(lastNameMessages),
      country: shortStringValidation().messages(countryMessages),
      email: emailValidation,
      birthDate: Joi.date().max(cutoffDateMax).min(cutoffDateMin).required().messages({
        'date.max': 'You need to be older than 18 years old.',
        'date.min': 'You need to be younger than 100 years old.',
        'any.required': 'Date is a required field.',
        'date.base': 'Birth date must have a mm/dd/yyyy format.',
      }),
      dni: dniValidation,
      phone: phoneValidation,
      isActive: Joi.boolean().required(),
    });
    let validation;
    if (postulantInfo) {
      validation = schema.validate(postulantInfo);
    } else validation = schema.validate(req.body);
    if (validation.error) {
      throw new CustomError(400, validation.error.details[0].message);
    }
    return !postulantInfo && next && next();
  };
};

export default {
  postulantValidation,
};
