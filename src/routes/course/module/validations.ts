import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { ModuleType } from 'src/models/module';

const moduleJoiSchema = Joi.object<ModuleType>({
  // course: Joi.string()
  //   .pattern(/^[0-9a-fA-F]{24}$/)
  //   .required()
  //   .messages({
  //     'string.pattern.base': 'Invalid course id, ObjectId expected.',
  //     'any.required': 'Course id is a required field.',
  //   }),
  name: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Invalid name, it must contain more than 3 letters.',
    'string.max': 'Invalid name, it must not contain more than 50 letters.',
    'any.required': 'Name is a required field.',
  }),
  description: Joi.string().min(5).max(50).required().messages({
    'string.min': 'Invalid description, it must contain more than 5 letters.',
    'string.max': 'Invalid description, it must not contain more than 200 letters.',
    'any.required': 'Description is a required field.',
  }),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required().messages({
    'string.valid': 'Invalid status, should be one of the valids status.',
    'any.required': 'Status is a required field.',
  }),
  type: Joi.string().valid('DEV', 'QA', 'UXUI', 'GENERAL').required().messages({
    'string.valid': 'Invalid type, should be one of the valids types.',
    'any.required': 'Type is a required field.',
  }),
  groups: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid group id, ObjectId expected.',
          'any.required': 'Group id is a required field.',
        }),
    )
    .optional()
    .unique(),
  contents: Joi.array()
    .items(
      Joi.string().min(3).max(24).required().messages({
        'string.min': 'Invalid content name, it must contain more than 3 letters.',
        'string.max': 'Invalid content name, it must not contain more than 24 letters.',
        'any.required': 'Name is a required field.',
      }),
    )
    .optional(),
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
