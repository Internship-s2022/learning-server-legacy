import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { AnswerType, PostulantCourseType } from 'src/models/postulant-course';

const validateCreation = (req: Request, res: Response, next: NextFunction) => {
  const validateCreation = Joi.object<PostulantCourseType>({
    postulant: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid postulant id, ObjectId expected.',
        'any.required': 'Postulant id is a required field.',
      }),
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
            Joi.string().allow(null).max(200).messages({
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
      .required()
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

const validateCorrection = (req: Request, res: Response, next: NextFunction) => {
  const validateCorrection = Joi.array()
    .items(
      Joi.object({
        postulantId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid postulant id, ObjectId expected.',
            'string.empty': 'Postulant is not allowed to be empty.',
            'any.required': 'Postulant id is a required field.',
          }),
        scores: Joi.array()
          .items(
            Joi.object({
              admissionResult: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .required()
                .messages({
                  'string.pattern.base': 'Invalid admission result id, ObjectId expected.',
                  'string.empty': 'Admission result is not allowed to be empty.',
                  'any.required': 'Admission result id is a required field inside Scores array.',
                }),
              score: Joi.number().min(0).max(10).required().messages({
                'number.min': 'The score must be a positive number.',
                'number.max': 'The score must be lower than 10.',
                'any.required': 'Score is a required field inside Scores array.',
              }),
            })
              .required()
              .messages({
                'object.base':
                  'Scores must contain an object with two fields: admissionResult and score.',
              }),
          )
          .unique('admissionResult')
          .required()
          .messages({
            'array.base': 'Scores must be an array.',
            'array.unique':
              'Admission test result id repeated. There should not be two similar ids.',
            'array.includesRequiredUnknowns':
              'Scores should include two fields: admissionResult and score.',
            'any.required': 'Scores is a required field.',
          }),
      }),
    )
    .unique('postulantId')
    .messages({
      'array.unique': 'Postulant id repeated. There should not be two similar postulantIds.',
    });
  const validation = validateCorrection.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};

const validatePromotion = (req: Request, res: Response, next: NextFunction) => {
  const validatePromotion = Joi.array()
    .items(
      Joi.object({
        postulantId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid postulant id, ObjectId expected.',
            'string.empty': 'Postulant is not allowed to be empty.',
            'any.required': 'PostulantId is a required field.',
          }),
      })
        .required()
        .messages({
          'object.base': 'The array must contain only objects.',
        }),
    )
    .unique('postulantId')
    .messages({
      'array.base': 'The data must be an array.',
      'array.unique': 'Postulant id repeated. There should not be two similar postulantIds.',
      'array.includesRequiredUnknowns': 'The data should include at least one postulant id.',
    });

  const validation = validatePromotion.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};
export default { validateCreation, validateCorrection, validatePromotion };
