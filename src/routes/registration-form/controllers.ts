import { Request, Response } from 'express';

import { CustomError } from 'src/models/custom-error';
import RegistrationForm, { RegistrationFormType } from 'src/models/registration-form';
import { paginateAndFilterByIncludes } from 'src/utils/query';

const getRegistrationFormPipeline = (query: qs.ParsedQs) => [
  {
    $lookup: {
      from: 'courses',
      localField: 'course',
      foreignField: '_id',
      as: 'course',
    },
  },
  { $unwind: { path: '$course' } },
  { $match: query },
];

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const registrationFormAggregate = RegistrationForm.aggregate(getRegistrationFormPipeline(query));
  const { docs, ...pagination } = await RegistrationForm.aggregatePaginate(
    registrationFormAggregate,
    { page, limit },
  );
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of registration forms',
      data: docs,
      pagination,
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
    course: req.body.course,
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
  if (!registrationForm?.isActive) {
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

const physicalDeleteById = async (req: Request, res: Response) => {
  const result = await RegistrationForm.findByIdAndDelete(req.params.id);
  if (result) {
    return res.status(200).json({
      message: `The registration form with id ${req.params.id} has been successfully deleted`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Registration form with id ${req.params.id} was not found.`);
};

export default { getAll, getById, create, updateById, deleteById, physicalDeleteById };
