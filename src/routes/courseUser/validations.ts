import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';

const courseUserValidations = (req: Request, res: Response, next: NextFunction) => {
  const courseUserValidations = Joi.object<CourseUserType>({
    courseId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid course id, ObjectId expected',
        'any.required': 'Course id is a required field',
      }),
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid course id, ObjectId expected',
        'any.required': 'User id is a required field',
      }),
    role: Joi.string().required().valid('ADMIN', 'TUTOR', 'AUXILIARY', 'STUDENT').messages({
      'any.only': 'The role must be one of: ADMIN, TUTOR, AUXILIARY or STUDENT',
      'any.required': 'Role is a required field',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is required',
    }),
  });

  const validation = courseUserValidations.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { courseUserValidations };
