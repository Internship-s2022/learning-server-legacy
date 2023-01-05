import { Request, Response } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';
import Group, { GroupType } from 'src/models/group';
import Module, { ModuleType } from 'src/models/module';
import { filterIncludeArrayOfIds, paginateAndFilter } from 'src/utils/query';

import { getModulePipeline } from './aggregations';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, sort, query } = paginateAndFilter(req.query);
  const moduleAggregate = Module.aggregate(
    getModulePipeline({ ...query, course: new mongoose.Types.ObjectId(req.params.courseId) }, sort),
  );
  const { docs, ...pagination } = await Module.aggregatePaginate(moduleAggregate, {
    page,
    limit,
  });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of modules.',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of modules.');
};

const getById = async (req: Request, res: Response) => {
  const module = await Module.findOne({
    _id: new mongoose.Types.ObjectId(req.params.moduleId),
  }).populate({ path: 'groups' });
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

const deleteModuleFromGroups = async (moduleId: string, groupsIdsToDeleteFrom: string[] = []) => {
  try {
    const groups = await Group.find(
      groupsIdsToDeleteFrom.length > 0
        ? filterIncludeArrayOfIds(groupsIdsToDeleteFrom)
        : { modules: { $in: moduleId } },
    );

    const groupsWithoutModule: GroupType[] = groups.map((group) => ({
      ...group.toObject(),
      modules: group.modules.filter((_id) => _id.toString() !== moduleId),
    }));

    await Promise.all(
      groupsWithoutModule.map(async ({ _id, ...rest }) => {
        await Group.findByIdAndUpdate(_id, rest, {
          new: true,
        });
      }),
    );
    return true;
  } catch {
    return false;
  }
};

const addModuleToGroups = async (moduleId: string, groupsIdsToAddTo: string[]) => {
  try {
    const groups = await Group.find(filterIncludeArrayOfIds(groupsIdsToAddTo));

    const groupsWithModule: GroupType[] = groups.map((group) => ({
      ...group.toObject(),
      modules: [...group.modules, new mongoose.Types.ObjectId(moduleId)],
    }));

    await Promise.all(
      groupsWithModule.map(async ({ _id, ...rest }) => {
        await Group.findByIdAndUpdate(_id, rest, {
          new: true,
        });
      }),
    );
    return true;
  } catch {
    return false;
  }
};

const updateById = async (req: Request, res: Response) => {
  const moduleId = req.params.moduleId;

  const moduleByName = await Module.find({
    name: req.body.name,
    course: req.params.courseId,
    isActive: true,
  });

  if (moduleByName.length && moduleByName[0]._id.toString() !== moduleId) {
    throw new CustomError(404, `The module name: "${req.body.name}" already exist.`);
  }

  const groupsIdsInBody: string[] = req.body?.groups || [];
  const groupsInBody = await Group.find(filterIncludeArrayOfIds(groupsIdsInBody));

  if (groupsIdsInBody.length !== groupsInBody.length) {
    throw new CustomError(404, 'One or more of the the groups do not exist.');
  }

  const module = await Module.findById(moduleId);

  const groupsIdsInModule: string[] = module
    ? module?.groups.map((group) => group._id.toString())
    : [];

  const groupsIdsToDeleteFrom = _.difference(groupsIdsInModule, groupsIdsInBody);
  const groupsIdsToAddTo = _.difference(groupsIdsInBody, groupsIdsInModule);

  if (groupsIdsToDeleteFrom.length) {
    const successDeleteFromGroups = await deleteModuleFromGroups(moduleId, groupsIdsToDeleteFrom);
    if (!successDeleteFromGroups) {
      throw new CustomError(500, 'There was an error while deleting the module from the groups.');
    }
  }

  if (groupsIdsToAddTo.length) {
    const successAddToGroups = await addModuleToGroups(moduleId, groupsIdsToAddTo);
    if (!successAddToGroups) {
      throw new CustomError(500, 'There was an error while adding the module to the groups.');
    }
  }

  const updatedModule = await Module.findByIdAndUpdate(moduleId, req.body, {
    new: true,
  });
  if (updatedModule) {
    return res.status(200).json({
      message: 'The module has been successfully updated.',
      data: updatedModule,
      error: false,
    });
  }
  throw new CustomError(404, `Module with id ${moduleId} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const successDeleteFromGroups = await deleteModuleFromGroups(req.params.moduleId);
  if (!successDeleteFromGroups) {
    throw new CustomError(500, 'There was an error while deleting the module from the groups.');
  }
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
  const successDeleteFromGroups = await deleteModuleFromGroups(req.params.moduleId);
  if (!successDeleteFromGroups) {
    throw new CustomError(500, 'There was an error while deleting the module from the groups');
  }
  const module = await Module.findById(req.params.moduleId);
  if (!module?.isActive) {
    throw new CustomError(400, 'This module has already been disabled.');
  }
  const result = await Module.findByIdAndUpdate(
    req.params.moduleId,
    { isActive: false, groups: [] },
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
