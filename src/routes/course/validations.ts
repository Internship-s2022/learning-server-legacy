import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import Course, { CourseWithUsers } from 'src/models/course';
import { CustomError } from 'src/models/custom-error';

const courseValidation = (req: Request, res: Response, next: NextFunction) => {
  const courseValidation = Joi.object<CourseWithUsers>({
    name: Joi.string().min(3).max(50).required().messages({
      'string.min': 'Invalid course name, it must contain more than 3 letters.',
      'string.max': 'Invalid course name, it must not contain more than 50 letters.',
      'any.required': 'Name is a required field.',
    }),
    admissionTests: Joi.array().items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid admission test id, ObjectId expected.',
          'any.required': 'Admission tests id is a required field.',
        }),
    ),
    description: Joi.string()
      .pattern(/(.*[a-zA-Z]){4}/)
      .max(200)
      .required()
      .messages({
        'string.pattern.base': 'Invalid description, it must contain at least 4 letters.',
        'any.required': 'Description is a required field.',
      }),
    inscriptionStartDate: Joi.date().greater('now').required().messages({
      'date.greater': 'Invalid inscription start date, it must be after the current date.',
      'any.required': 'Inscription start date is a required field.',
    }),
    inscriptionEndDate: Joi.date().greater(Joi.ref('inscriptionStartDate')).required().messages({
      'date.greater': 'Invalid inscription end date, it must be after the inscription start date.',
      'any.required': 'Inscription end date is a required field.',
    }),
    startDate: Joi.date().greater(Joi.ref('inscriptionEndDate')).required().messages({
      'date.greater': 'Invalid start date, it must be after the inscription end date.',
      'any.required': 'Start date is a required field.',
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).messages({
      'date.greater': 'Invalid end date, it must be after the course start date.',
    }),
    type: Joi.string().valid('EXPRESS', 'FULL').messages({
      'any.required': 'Type is a required field.',
    }),
    isInternal: Joi.boolean().required().messages({
      'any.required': 'Is internal is a required field.',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is a required field.',
    }),
    courseUsers: Joi.array()
      .items(
        Joi.object({
          user: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required(),
          isActive: Joi.boolean().required(),
          role: Joi.string().valid('ADMIN', 'TUTOR', 'AUXILIARY', 'STUDENT').required().messages({
            'any.required': 'The role must be one of the assigned.',
            'string.valid': 'Role must be valid.',
          }),
        }),
      )
      .min(2)
      .has(
        Joi.object({
          user: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required(),
          isActive: Joi.boolean().required(),
          role: Joi.string().valid('TUTOR'),
        }),
      )
      .has(
        Joi.object({
          user: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required(),
          isActive: Joi.boolean().required(),
          role: Joi.string().valid('ADMIN'),
        }),
      )
      .unique('user')
      .required()
      .messages({
        'array.min': 'Must have at least two course users.',
        'array.unique': 'There are repeated users, just one user by course.',
        'array.hasUnknown': 'There must be at least one ADMIN and one TUTOR.',
        'any.required': 'Course users must be a required field.',
        'string.pattern.base': 'Invalid user id, ObjectId expected.',
      }),
  });

  const validation = courseValidation.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

const courseId = async (req: Request, res: Response, next: NextFunction) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    throw new CustomError(400, `Course with id ${req.params.courseId} was not found.`);
  }
  return next();
};

export default { courseValidation, courseId };
