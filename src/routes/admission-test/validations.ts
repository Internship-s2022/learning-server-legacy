import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { nameMessages } from 'src/constants/validation-messages';
import { longStringRegex, shortStringValidation } from 'src/middlewares/validations';
import { AdmissionTestType } from 'src/models/admission-test';
import { CustomError } from 'src/models/custom-error';

export const admissionTestSchema = Joi.object<AdmissionTestType>({
  name: shortStringValidation(longStringRegex).messages(nameMessages),
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
