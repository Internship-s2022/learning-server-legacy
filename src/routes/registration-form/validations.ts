import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const registrationFormValidation = (req: Request, res: Response, next: NextFunction) => {
  const registrationFormValidation = Joi.object({
    course_id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid ObjectId, it must be a valid MongoId',
        'any.required': 'Course id is a required field',
      }),
    title: Joi.string().min(3).max(50).required().messages({
      'string.min': 'Invalid title, it must contain more than 3 letters',
      'string.max': 'Invalid title, it must not contain more than 50 letters',
      'any.required': 'Title is a required field',
    }),
    description: Joi.string()
      .pattern(/(.*[a-zA-Z]){4}/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid description, it must contain at least 4 letters',
        'any.required': 'Description is a required field',
      }),
    views: Joi.array().items(Joi.string().min(3).max(24).required()).required().messages({
      'string.max': 'Invalid view name, it must not contain more than 24 characters',
      'string.min': 'Invalid view name, it must contain more than 3 characters',
      'any.required': 'Missing required data',
    }),
    isActive: Joi.boolean().required().messages({
      'any.required': 'Is active is a required field',
    }),
  });

  const validation = registrationFormValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: 'There has been an error in the validation',
      data: validation.error.details[0].message,
      error: true,
    });
  }
  return next();
};

export default { registrationFormValidation };
