import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { AnswerType, PostulantCourseType } from 'src/models/postulant-course';

const validateCreation = (req: Request, res: Response, next: NextFunction) => {
  const validateCreation = Joi.object<PostulantCourseType>({
    answer: Joi.array()
      .items(
        Joi.object<AnswerType>({
          question: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
              'string.pattern.base': 'Invalid question id, ObjectId expected.',
              'string.empty': 'Question id is not allowed to be empty.',
              'any.required': 'Question id is a required field.',
            }),
          value: [
            Joi.string().allow('').max(200).messages({
              'string.empty': 'Value is not allowed to be empty.',
              'string.max': 'Answer can not have more than 200 characters.',
            }),
            Joi.array().items(Joi.string()).messages({
              'string.base': 'Invalid value array. It must contain only elements of type string.',
              'string.empty': 'Value is not allowed to be an empty array.',
            }),
          ],
        }).messages({
          'alternatives.types': 'Invalid value. It must be a string or an array of strings.',
        }),
      )
      .unique('question')
      .required()
      .messages({
        'array.base': 'Answer field must be an array.',
        'array.unique': 'Question id repeated. There should not be two similar QuestionIds.',
        'array.includesRequiredUnknowns': 'Answer should include question id field.',
        'any.required': 'Answer is a required field.',
      }),
    view: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid view id, ObjectId expected.',
        'any.required': 'View id is a required field.',
      }),
  });

  const validation = validateCreation.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

export default { validateCreation };
