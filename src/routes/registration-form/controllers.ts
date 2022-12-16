import { Request, Response } from 'express';

import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import RegistrationForm, { RegistrationFormType } from 'src/models/registration-form';
import { paginateAndFilter } from 'src/utils/query';

import { getRegistrationFormPipeline } from './aggregation';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query, sort } = paginateAndFilter(req.query);
  const registrationFormAggregate = RegistrationForm.aggregate(
    getRegistrationFormPipeline(query, sort),
  );
  const { docs, ...pagination } = await RegistrationForm.aggregatePaginate(
    registrationFormAggregate,
    { page, limit },
  );
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of registration forms.',
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
      message: 'The registration form has been successfully found.',
      data: registrationForm,
      error: false,
    });
  }
  throw new CustomError(404, `Registration form with id ${req.params.id} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const course = await Course.findById(req.body.course);
  if (!course?.isActive) {
    if (!course) {
      throw new CustomError(404, `Course with the id ${req.body.course} was not found.`);
    }
    throw new CustomError(404, `Course with the id ${req.body.course} is not active.`);
  }
  const formName = await RegistrationForm.findOne({ title: req.body.title, isActive: true });
  if (formName?.title) {
    throw new CustomError(
      400,
      `An active registration form with name ${req.body.title} already exists.`,
    );
  }

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
  const course = await Course.findById(req.body.course);
  if (!course?.isActive) {
    if (!course) {
      throw new CustomError(404, `Course with the id ${req.body.course} was not found.`);
    }
    throw new CustomError(404, `Course with the id ${req.body.course} is not active.`);
  }
  const formName = await RegistrationForm.findOne({ title: req.body.title, isActive: true });
  if (formName?.title) {
    throw new CustomError(
      400,
      `An active registration form with name ${req.body.title} already exists.`,
    );
  }
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
    throw new CustomError(400, 'This registration form has already been disabled.');
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
      message: 'The registration form has been successfully disabled.',
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
      message: `The registration form with id ${req.params.id} has been successfully deleted.`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Registration form with id ${req.params.id} was not found.`);
};

export default { getAll, getById, create, updateById, deleteById, physicalDeleteById };
