import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';
import { AnswerType, PostulantCourseType } from 'src/models/postulant-course';

const validateCreation = (req: Request, res: Response, next: NextFunction) => {
  const validateCreation = Joi.object<PostulantCourseType>({
    course: Joi.string(),
    postulant: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid postulant id, ObjectId expected.',
        'any.required': 'Postulant id is a required field.',
      }),
    admissionResults: Joi.array(),
    answer: Joi.array().items(
      Joi.object<AnswerType>({
        question: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid question id, ObjectId expected.',
            'any.required': 'Question id is a required field.',
          }),
        value: Joi.string().allow(null),
      }),
    ),
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
  const validateCorrection = Joi.array().items(
    Joi.object({
      postulantId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid postulant id, ObjectId expected.',
          'any.required': 'Postulant id is a required field.',
        }),
      scores: Joi.array()
        .items(
          Joi.object({
            admissionTestResult: Joi.string()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required()
              .messages({
                'string.pattern.base': 'Invalid admission result id, ObjectId expected.',
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
                'Scores must contain an object with two fields: admissionTestResult and score.',
            }),
        )
        .required()
        .messages({
          'array.base': 'Scores must be an array.',
          'array.includesRequiredUnknowns':
            'Scores should include two fields: admissionTestResult and score.',
          'any.required': 'Scores is a required field.',
        }),
    }),
  );

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
            'any.required': 'PostulantId is a required field.',
          }),
      })
        .required()
        .messages({
          'object.base': 'The array must contain only objects.',
        }),
    )
    .messages({
      'array.base': 'The data must be an array.',
      'array.includesRequiredUnknowns': 'The data should include at least one postulant id.',
    });

  const validation = validatePromotion.validate(req.body);

  if (validation.error) {
    throw new CustomError(400, validation.error.details[0].message);
  }
  return next();
};
export default { validateCreation, validateCorrection, validatePromotion };
