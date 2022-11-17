import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';
import Module, { ModuleType } from 'src/models/module';
import { filterByIncludes } from 'src/utils/query';

const getAll = async (req: Request, res: Response) => {
  const query = filterByIncludes({
    ...req.query,
    course: req.params.courseId,
  });
  const docs = await Module.find(query);
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of modules.',
      data: docs,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of modules.');
};

const getById = async (req: Request, res: Response) => {
  const module = await Module.findById(req.params.moduleId);
  if (module) {
    return res.status(200).json({
      message: 'The module has been successfully found.',
      data: module,
      error: false,
    });
  }
  throw new CustomError(404, `Module with id ${req.params.moduleId} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const moduleByName = await Module.find({
    name: req.body.name,
    course: req.params.courseId,
    isActive: true,
  });
  if (moduleByName.length) {
    throw new CustomError(404, 'The module name already exist.');
  }
  try {
    const courseId = new mongoose.Types.ObjectId(req.params.courseId);
    const module = new Module<ModuleType>({
      course: courseId,
      ...req.body,
    });
    const response = await module.save();
    return res.status(201).json({
      message: 'Modules successfully created.',
      data: response,
      error: false,
    });
  } catch {
    throw new CustomError(404, 'There was an error during the creation of the module.');
  }
};

const updateById = async (req: Request, res: Response) => {
  const moduleByName = await Module.find({
    name: req.body.name,
    course: req.params.courseId,
    isActive: true,
  });
  if (moduleByName.length) {
    throw new CustomError(404, 'The module name already exist.');
  }
  const updatedModule = await Module.findByIdAndUpdate(req.params.moduleId, req.body, {
    new: true,
  });
  if (updatedModule) {
    return res.status(200).json({
      message: 'The module has been successfully updated.',
      data: updatedModule,
      error: false,
    });
  }
  throw new CustomError(404, `Module with id ${req.params.moduleId} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const result = await Module.findByIdAndDelete(req.params.moduleId);
  if (result) {
    return res.status(200).json({
      message: `The module with id ${req.params.moduleId} has been successfully deleted.`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Module with id ${req.params.moduleId} was not found.`);
};

const deleteById = async (req: Request, res: Response) => {
  const module = await Module.findById(req.params.moduleId);
  if (!module?.isActive) {
    throw new CustomError(400, 'This module has already been disabled.');
  }
  const result = await Module.findByIdAndUpdate(
    req.params.moduleId,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result) {
    return res.status(200).json({
      message: 'The module has been successfully disabled.',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Module with id ${req.params.moduleId} was not found.`);
};

export default { getAll, getById, create, updateById, physicalDeleteById, deleteById };
