import { Request, Response } from 'express';

import { CustomError } from 'src/models/custom-error';
import RegistrationForm, { RegistrationFormType } from 'src/models/registration-form';
import { filterByIncludes } from 'src/utils/query';

const getAll = async (req: Request, res: Response) => {
  const registrationForms = await RegistrationForm.find(filterByIncludes(req.query));
  if (registrationForms.length) {
    return res.status(200).json({
      message: 'Showing the list of registration forms',
      data: registrationForms,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of registration forms.');
};

const getById = async (req: Request, res: Response) => {
  const registrationForm = await RegistrationForm.findById(req.params.id);
  if (registrationForm) {
    return res.status(200).json({
      message: 'The registration form has been successfully found',
      data: registrationForm,
      error: false,
    });
  }
  throw new CustomError(404, `Registration form with id ${req.params.id} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const registrationForm = new RegistrationForm<RegistrationFormType>({
    courseId: req.body.courseId,
    title: req.body.title,
    description: req.body.description,
    views: req.body.views,
    isActive: req.body.isActive,
  });
  await registrationForm.save();
  return res.status(201).json({
    message: 'Registration form successfully created.',
    data: registrationForm,
    error: false,
  });
};

const updateById = async (req: Request, res: Response) => {
  const updatedRegistrationForm = await RegistrationForm.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  );
  if (updatedRegistrationForm) {
    return res.status(200).json({
      message: 'The registration form has been successfully updated.',
      data: updatedRegistrationForm,
      error: false,
    });
  }
  throw new CustomError(404, `Registration form with id ${req.params.id} was not found.`);
};

const deleteById = async (req: Request, res: Response) => {
  const registrationForm = await RegistrationForm.findById(req.params.id);
  if (registrationForm?.isActive === false) {
    throw new CustomError(404, 'Registration form has already been deleted');
  }
  const result = await RegistrationForm.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result) {
    return res.status(200).json({
      message: 'The registration form has been successfully deleted',
      data: result,
      error: false,
    });
  }

  throw new CustomError(404, `Registration form with id ${req.params.id} was not found.`);
};

export default { getAll, getById, create, updateById, deleteById };
