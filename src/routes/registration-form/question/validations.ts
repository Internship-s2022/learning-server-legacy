import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { optionMessages, titleMessages } from 'src/constants/validation-messages';
import { mediumStringValidation } from 'src/middlewares/validations';
import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import { Option, QuestionType } from 'src/models/question';
import RegistrationForm, { RegistrationFormDocument } from 'src/models/registration-form';

const option = Joi.object<Option>({
  _id: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid view id, ObjectId expected.',
    }),
  value: mediumStringValidation().messages(optionMessages),
})
  .required()
  .messages({
    'string.pattern.base': 'Invalid value, it must not start nor end with whitespace.',
    'any.required': 'Invalid option value, it must contain at least one character.',
    'string.max': 'Invalid option value, it must not contain more than 50 characters.',
  });

const question = Joi.object<QuestionType>({
  _id: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid view id, ObjectId expected.',
    }),
  registrationForm: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid view id, ObjectId expected.',
      'any.required': 'Registration form id is a required field.',
    }),
  key: Joi.string().optional(),
  title: mediumStringValidation().messages(titleMessages),
  type: Joi.string()
    .valid('SHORT_ANSWER', 'PARAGRAPH', 'DROPDOWN', 'CHECKBOXES', 'MULTIPLE_CHOICES')
    .required()
    .messages({
      'string.valid': 'Invalid type, should be one of the valids types.',
      'any.required': 'Type is a required field.',
    }),
  options: Joi.when('type', {
    is: Joi.string().valid('SHORT_ANSWER', 'PARAGRAPH'),
    then: Joi.valid(null),
    otherwise: Joi.array().items(option).unique('value').max(200).required(),
  }).messages({
    'any.max': 'No more than 200 questions per view in the Registration Form.',
    'any.required': 'Options is a required field.',
  }),
  view: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid view id, ObjectId expected.',
      'any.required': 'View id is a required field.',
    }),
  isRequired: Joi.boolean().required().messages({
    'any.required': 'Is required is a required field.',
  }),
});

const questionValidation = (bodyType: 'array' | 'object') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const questionValidation =
      bodyType === 'array' ? Joi.array().items(question).unique('title').min(1).max(200) : question;
    const validation = questionValidation.validate(req.body);
    if (validation.error) {
      throw new CustomError(400, validation.error.details[0].message);
    }
    return next();
  };
};

const courseInscriptionDate = async (req: Request, res: Response, next: NextFunction) => {
  const registrationForm = (await RegistrationForm.findById(
    req.params.regFormId,
  )) as RegistrationFormDocument;
  const course = await Course.findById(registrationForm.course);
  if (!course) {
    throw new CustomError(404, `Course with id ${registrationForm.course} was not found.`);
  }
  if (course?.inscriptionStartDate) {
    if (new Date() < course.inscriptionStartDate) {
      return next();
    } else {
      throw new CustomError(
        400,
        'The course inscription has already started, questions cannot be added, removed, nor edited.',
      );
    }
  }
};

export default { questionValidation, courseInscriptionDate };
