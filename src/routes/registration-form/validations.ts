import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { CustomError } from 'src/models/custom-error';

const registrationFormValidation = (requestType: 'post' | 'put') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const registrationFormValidation = Joi.object({
      course_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid course id, ObjectId expected',
          'any.required': 'Course id is a required field',
        }),
      title: Joi.string().min(3).max(50).required().messages({
        'string.min': 'Invalid title, it must contain more than 3 letters',
        'string.max': 'Invalid title, it must not contain more than 50 letters',
        'any.required': 'Title is a required field',
      }),
      description: Joi.string().min(8).max(150).required().messages({
        'string.min': 'Invalid description, it must contain more than 8 letters',
        'string.max': 'Invalid description, it must not contain more than 150 letters',
        'any.required': 'Description is a required field',
      }),
      views: Joi.array()
        .min(1)
        .items(
          Joi.object({
            name: Joi.string().min(3).required(),
            _id:
              requestType === 'post'
                ? Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .optional()
                : Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .required(),
          }),
        )
        .required()
        .messages({
          'string.max': 'Invalid view name, it must not contain more than 24 characters',
          'string.min': 'Invalid view name, it must contain more than 3 characters',
          'array.min': 'At least one view is required',
          'array.required': 'Views is required',
          'string.required': 'Views name is required',
          'string.pattern.base': 'Invalid view _id, ObjectId expected',
        }),
      isActive: Joi.boolean().required().messages({
        'any.required': 'Is active is required',
      }),
    });

    const validation = registrationFormValidation.validate(req.body);

    if (validation.error) {
      throw new CustomError(400, validation.error.details[0].message, undefined);
    }
    return next();
  };
};

export default { registrationFormValidation };
