import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const courseValidation = (req: Request, res: Response, next: NextFunction) => {
  const courseValidation = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.min': 'Invalid course name, it must contain more than 3 letters',
      'string.max': 'Invalid course name, it must not contain more than 50 letters',
      'any.required': 'Name is a required field',
    }),
    description: Joi.string()
      .pattern(/(.*[a-zA-Z]){4}/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid description, it must contain at least 4 letters',
        'any.required': 'Description is a required field',
      }),
    inscriptionStartDate: Joi.date().greater('now').messages({
      'date.greater': 'Invalid inscription start date, it must be after the current date',
    }),
    inscriptionEndDate: Joi.date().greater(Joi.ref('inscriptionStartDate')).messages({
      'date.greater': 'Invalid inscription end date, it must be after the inscription start date',
    }),
    startDate: Joi.date().greater(Joi.ref('inscriptionEndDate')).optional().messages({
      'date.greater': 'Invalid start date, it must be after the inscription end date',
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).optional().messages({
      'date.greater': 'Invalid end date, it must be after the course start date',
    }),
    isInternal: Joi.boolean().required(),
    isActive: Joi.boolean().required(),
  });

  const validation = courseValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: 'There has been an error in the validation',
      data: validation.error.details[0].message,
      error: true,
    });
  }
  return next();
};
