import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { contentNameMessages } from 'src/constants/validation-messages';
import {
  containSpecialCharactersRegex,
  descriptionValidation,
  moduleTypeValidation,
  nameValidation,
  shortStringValidation,
} from 'src/middlewares/validations';
import { CustomError } from 'src/models/custom-error';
import { ModuleType } from 'src/models/module';

const moduleJoiSchema = Joi.object<ModuleType>({
  name: nameValidation,
  description: descriptionValidation,
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required().messages({
    'string.valid': 'Invalid status, should be one of the valid status.',
    'any.required': 'Status is a required field.',
  }),
  type: moduleTypeValidation,
  groups: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
          'string.pattern.base': 'Invalid group id, ObjectId expected.',
          'any.required': 'Group id is a required field.',
        }),
    )
    .optional()
    .max(200)
    .unique(),
  contents: Joi.array()
    .items(
      shortStringValidation(containSpecialCharactersRegex).min(2).messages(contentNameMessages),
    )
    .optional()
    .max(200),
  isActive: Joi.boolean().required().messages({
    'any.required': 'Is active is a required field.',
  }),
});

const moduleValidation = (req: Request, res: Response, next: NextFunction) => {
  const validation = moduleJoiSchema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { moduleValidation };
