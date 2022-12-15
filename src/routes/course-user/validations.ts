import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';

const courseUserValidations = (requestType: 'post' | 'put') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const courseUserValidations = Joi.object<CourseUserType>({
      course: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid course id, ObjectId expected.',
          'any.required': 'Course id is a required field.',
        }),

      user:
        requestType === 'post'
          ? Joi.string()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required()
              .messages({
                'string.pattern.base': 'Invalid user id, ObjectId expected.',
                'any.required': 'User id is a required field.',
              })
          : Joi.string()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .messages({
                'string.pattern.base': 'Invalid course id, ObjectId expected',
              }),
      role: Joi.string().required().valid('ADMIN', 'TUTOR', 'AUXILIARY', 'STUDENT').messages({
        'any.only': 'The role must be one of: ADMIN, TUTOR, AUXILIARY or STUDENT.',
        'any.required': 'Role is a required field.',
      }),
      isActive: Joi.boolean().messages({
        'any.required': 'Is active is required',
      }),
    });

    const validation = courseUserValidations.validate(req.body);

    if (validation.error) {
      throw new CustomError(400, validation.error.details[0].message);
    }
    return next();
  };
};

const courseUserDelete = (req: Request, res: Response, next: NextFunction) => {
  const courseUserValidation = Joi.object({
    course: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid course id, ObjectId expected.',
        'any.required': 'Course id is a required field.',
      }),
    user: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid user id, ObjectId expected.',
        'any.required': 'User id is a required field.',
      }),
  });

  const validation = courseUserValidation.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

const courseUserByModuleIds = (req: Request, res: Response, next: NextFunction) => {
  const courseUserValidation = Joi.object({
    modules: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid module id, ObjectId expected.',
            'any.required': 'Module id is a required field.',
          }),
      )
      .required()
      .min(1)
      .max(250)
      .messages({
        'any.min': 'Modules should have at least one module id.',
        'any.required': 'Modules is a required field.',
      }),
  });

  const { modules } = req.query;
  req.body.modules = Array.isArray(modules) ? modules : [modules];
  const validation = courseUserValidation.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { courseUserValidations, courseUserDelete, courseUserByModuleIds };
