import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { ExamType, ReportType } from 'src/models/report';

const exam = Joi.object<ExamType>({
  name: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Invalid name, it must contain more than 3 letters.',
    'string.max': 'Invalid name, it must not contain more than 50 letters.',
    'any.required': 'First Name is a required field.',
  }),
  grade: Joi.number().greater(-1).less(11),
});

const reportJoiSchema = Joi.array()
  .items(
    Joi.object<ReportType>({
      _id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid report id, ObjectId expected.',
          'any.required': 'Report id is a required field.',
        }),
      exams: Joi.array().items(exam).unique('name').required().min(1).max(50).messages({
        'any.required': 'Exams id is a required field.',
      }),
      assistance: Joi.boolean().required(),
    }),
  )
  .required()
  .min(1)
  .max(750)
  .messages({
    'array.required': 'Reports is a required field.',
  });

const reportValidation = (req: Request, res: Response, next: NextFunction) => {
  const validation = reportJoiSchema.validate(req.body);
  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { reportValidation };
