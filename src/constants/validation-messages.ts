import Joi from 'joi';

// TO-DO: Create a function to generate dynamic messages
export const firstNameMessages: Joi.LanguageMessages = {
  'string.min': 'Invalid first name, it must contain more than 1 letter.',
  'string.max': 'Invalid first name, it must not contain more than 50 letters.',
  'string.pattern.base': 'Invalid name, it must contain only letters.',
  'any.required': 'First name is a required field.',
  'string.empty': 'First name is a required field.',
};

export const lastNameMessages: Joi.LanguageMessages = {
  'string.min': 'Invalid last name, it must contain more than 1 letter.',
  'string.max': 'Invalid last name, it must not contain more than 50 letters.',
  'string.pattern.base': 'Invalid last name, it must contain only letters.',
  'any.required': 'Last name is a required field.',
  'string.empty': 'Last name is a required field.',
};

export const countryMessages: Joi.LanguageMessages = {
  'string.min': 'Invalid country, it must contain more than 1 letter.',
  'string.max': 'Invalid country, it must not contain more than 50 letters.',
  'string.pattern.base': 'Invalid title, it must not start nor end with whitespace.',
  'any.required': 'Country is a required field.',
  'string.empty': 'Country is a required field.',
};

export const titleMessages: Joi.LanguageMessages = {
  'string.pattern.base': 'Invalid title, it must not start nor end with whitespace.',
  'string.min': 'Invalid title, it must contain more than 1 character.',
  'string.max': 'Invalid title, it must not contain more than 50 characters.',
  'any.required': 'Title is a required field.',
  'string.empty': 'Title is a required field.',
};

export const contentNameMessages: Joi.LanguageMessages = {
  'string.pattern.base': 'Invalid content name, it must not start nor end with whitespace.',
  'string.min': 'Invalid content name, it must contain more than 2 characters.',
  'string.max': 'Invalid content name, it must not contain more than 50 characters.',
  'any.required': 'Content name is a required field.',
  'string.empty': 'Content name cannot be empty.',
};

export const nameMessages: Joi.LanguageMessages = {
  'string.pattern.base': 'Invalid name, it must not start nor end with whitespace.',
  'string.min': 'Invalid name, it must contain more than 1 characters.',
  'string.max': 'Invalid name, it must not contain more than 50 characters.',
  'any.required': 'Name is a required field.',
  'string.empty': 'Name cannot be empty.',
};

export const descriptionMessages: Joi.LanguageMessages = {
  'string.pattern.base': 'Invalid description, it must not start nor end with whitespace.',
  'string.min': 'Invalid description, it must contain more than 3 characters.',
  'string.max': 'Invalid description, it must not contain more than 1000 characters.',
  'any.required': 'Description is a required field.',
  'string.empty': 'Description is a required field.',
};

export const emailMessages: Joi.LanguageMessages = {
  'string.empty': 'Email is required field.',
  'string.pattern.base': 'Invalid email format.',
  'string.max': 'Invalid description, it must not contain more than 256 characters.',
};

export const dniMessages: Joi.LanguageMessages = {
  'string.min': 'Invalid dni, it must contain more than 6 numbers.',
  'string.max': 'Invalid dni, it must not contain more than 8 numbers.',
  'string.pattern.base': 'Invalid dni, it must contain only numbers.',
  'any.required': 'Dni is a required field.',
};

export const phoneMessages: Joi.LanguageMessages = {
  'string.min': 'Invalid phone, it must contain 10 or 11 numbers.',
  'string.max': 'Invalid phone, it must contain 10 or 11 numbers.',
  'string.pattern.base': 'Invalid phone, it must contain only numbers.',
  'any.required': 'Phone is a required field.',
  'string.empty': 'Phone is a required field.',
};

export const optionMessages: Joi.LanguageMessages = {
  'string.pattern.base': 'Invalid option, it must not start nor end with whitespace.',
  'string.min': 'Invalid option, it must contain more than 1 character.',
  'string.max': 'Invalid option, it must not contain more than 50 characters.',
  'any.required': 'Option is a required field.',
  'string.empty': 'Option cannot be empty.',
};
