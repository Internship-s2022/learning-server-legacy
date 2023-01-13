import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { moduleTypeValidation, nameValidation } from 'src/middlewares/validations';
import { CustomError } from 'src/models/custom-error';
import { GroupType } from 'src/models/group';

const groupJoiSchema = Joi.object<GroupType>({
  name: nameValidation,
  type: moduleTypeValidation,
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
    .max(200)
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
