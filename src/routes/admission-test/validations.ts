import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { AdmissionTestType } from 'src/models/admission-test';
import { CustomError } from 'src/models/custom-error';

export const admissionTestSchema = Joi.object<AdmissionTestType>({
  name: Joi.string()
    .pattern(/^(?!\s)(?![\s\S]*\s$)[a-zA-Z0-9\s()-]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Invalid name, it must not start nor end with whitespaces.',
      'string.min': 'Invalid admission test name, it must contain more than 3 letter.',
      'string.max': 'Invalid admission test name, it must not contain more than 50 letters.',
      'any.required': 'Name is a required field.',
    }),
  isActive: Joi.boolean().required().messages({
    'any.required': 'Is active is a required field.',
  }),
});

const admissionTestValidation = (req: Request, res: Response, next: NextFunction) => {
  const validation = admissionTestSchema.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { admissionTestValidation };
