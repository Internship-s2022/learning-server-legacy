import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { GroupType } from 'src/models/group';

const groupJoiSchema = Joi.object<GroupType>({
  name: Joi.string()
    .pattern(/^(?!\s)(?![\s\S]*\s$)[a-zA-Z0-9\s()-]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Invalid name, it must not start nor end with whitespaces.',
      'string.min': 'Invalid name, it must contain more than 3 letters.',
      'string.max': 'Invalid name, it must not contain more than 50 letters.',
      'any.required': 'Name is a required field.',
    }),
  type: Joi.string().valid('DEV', 'QA', 'UXUI', 'GENERAL').required().messages({
    'string.valid': 'Invalid type, should be one of the valids types.',
    'any.required': 'Type is a required field.',
  }),
  courseUsers: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid course user id, ObjectId expected.',
          'any.required': 'Course users is a required field.',
        }),
    )
    .optional()
    .max(250)
    .unique(),
  modules: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid module id, ObjectId expected.',
          'any.required': 'Modules is a required field.',
        }),
    )
    .optional()
    .unique(),
  isActive: Joi.boolean().required().messages({
    'any.required': 'Is active is a required field.',
  }),
});

const groupValidation = (req: Request, res: Response, next: NextFunction) => {
  const validation = groupJoiSchema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { groupValidation };
