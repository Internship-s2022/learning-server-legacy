import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const courseValidation = (req: Request, res: Response, next: NextFunction) => {
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
    inscriptionStartDate: Joi.date().greater('now').required().messages({
      'date.greater': 'Invalid inscription start date, it must be after the current date',
      'any.required': 'Inscription start date is a required field',
    }),
    inscriptionEndDate: Joi.date().greater(Joi.ref('inscriptionStartDate')).required().messages({
      'date.greater': 'Invalid inscription end date, it must be after the inscription start date',
      'any.required': 'Inscription end date is a required field',
    }),
    startDate: Joi.date().greater(Joi.ref('inscriptionEndDate')).required().messages({
      'date.greater': 'Invalid start date, it must be after the inscription end date',
      'any.required': 'Start date is a required field',
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).messages({
      'date.greater': 'Invalid end date, it must be after the course start date',
    }),
    type: Joi.string().max(15).messages({
      'string.max': 'Invalid type, it must not contain more than 15 letters',
    }),
    isInternal: Joi.boolean().required().messages({
      'any.required': 'Is internal is a required field',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is a required field',
    }),
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

export default { courseValidation };
