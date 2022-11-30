import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { ReportType } from 'src/models/report';

const exam = Joi.object({
  _id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid exam id, ObjectId expected.',
      'any.required': 'Exam id is a required field.',
    }),
  grade: Joi.number().min(0).max(10).integer().required().messages({
    'number.min': 'The score must be a positive number.',
    'number.max': 'The score must be lower than 10.',
    'any.required': 'Score is a required field inside Scores array.',
  }),
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
      exams: Joi.array().items(exam).unique('_id').required().min(1).max(50).messages({
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
