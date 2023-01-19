import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';

import {
  descriptionMessages,
  dniMessages,
  emailMessages,
  nameMessages,
  phoneMessages,
} from 'src/constants/validation-messages';
import { CustomError } from 'src/models/custom-error';

const validateMongoId = (req: Request, res: Response, next: NextFunction) => {
  const entries = Object.entries(req.params);
  const idParams = entries.reduce<[string, boolean][]>((prev, [key, value]) => {
    if (key.toLowerCase().includes('id')) {
      prev.push([key, mongoose.Types.ObjectId.isValid(value)]);
    }
    return prev;
  }, []);
  if (!idParams.length) {
    throw new CustomError(400, 'Missing mongo id parameter.');
  }
  const invalidId = idParams.find((param) => param[1] === false);
  if (invalidId) {
    throw new CustomError(400, `Mongo id: ${invalidId[0]}  is not valid.`);
  }
  return next();
};

const validateDni = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.dni) {
    throw new CustomError(400, 'Missing dni parameter');
  }
  const dniValid = Joi.string()
    .min(6)
    .max(9)
    .pattern(/^[0-9]+$/);
  const validation = dniValid.validate(req.params.dni);

  if (validation.error) {
    throw new CustomError(400, `The dni: ${req.params.dni} is not valid`);
  }
  return next();
};

const validateFirebaseUid = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.uid) {
    throw new CustomError(400, 'Missing firebase uid parameter.');
  }

  const uid = Joi.string().min(28).max(36).messages({
    'string.min': 'The firebase uid is not valid 28 characters min.',
    'string.max': 'The firebase uid is not valid 36 characters max.',
  });

  const validation = uid.validate(req.params.uid);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export const namingRegex = /^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u;
export const shortStringRegex = /^(?!\s)(?![\s\S]*\s$)[A-Za-zÀ-ÖØ-öø-ÿ0-9\s()-]+$/;
export const containSpecialCharactersRegex =
  /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s() -`!@#$%^&*()_+=[\]{};':"\\|,<>/?~]+$/;
export const longStringRegex =
  /^(?!\s)(?![\s\S]*\s$)[A-Za-zÀ-ÖØ-öø-ÿ0-9\s()!@#$%^&*()_+={};':",.<>/¿?-]+$/;
export const emailRegex =
  /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+\b(?!\.)@[a-zA-Z0-9-]+(\.)[a-zA-Z0-9-]{2,3}$/;

export const moduleTypeValidation = Joi.string()
  .valid('DEV', 'QA', 'UX/UI', 'GENERAL')
  .required()
  .messages({
    'any.only': 'Invalid type, should be one of the valids types.',
    'any.required': 'Type is a required field.',
  });

export const shortStringValidation = (regex = shortStringRegex) =>
  Joi.string().pattern(regex).required().max(200).empty();

export const nameValidation = () => shortStringValidation().messages(nameMessages);

export const mediumStringValidation = (regex = longStringRegex) =>
  Joi.string().pattern(regex).required().max(200).empty();

export const longStringValidation = (regex = longStringRegex) =>
  Joi.string().pattern(regex).required().min(3).max(1000).empty();

export const descriptionValidation = longStringValidation().messages(descriptionMessages);

export const emailValidation = Joi.string()
  .required()
  .pattern(emailRegex)
  .max(256)
  .messages(emailMessages);

export const dniValidation = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(6)
  .max(8)
  .required()
  .messages(dniMessages);

export const phoneValidation = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(10)
  .max(11)
  .required()
  .messages(phoneMessages);

export const roleValidation = Joi.string()
  .valid('ADMIN', 'TUTOR', 'AUXILIARY', 'STUDENT')
  .required()
  .messages({
    'any.required': 'The role must be one of the assigned.',
    'string.valid': 'Role must be valid.',
  });

export default {
  validateMongoId,
  validateFirebaseUid,
  validateDni,
};
