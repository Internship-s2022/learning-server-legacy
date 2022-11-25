import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';
import Group, { GroupIdType, GroupType } from 'src/models/group';
import Module, { ModuleType } from 'src/models/module';
import {
  filterByIncludes,
  filterIncludeArrayOfIds,
  paginateAndFilterByIncludes,
} from 'src/utils/query';
import { getCourseUsersExcludeByModules } from 'src/utils/validateCourseUsers';
import { validateAtLeastOneRole } from 'src/utils/validateRole';

import { exportGroupPipeline, getGroupPipeline } from './aggregations';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const groupAggregate = Group.aggregate(
    getGroupPipeline({ ...query, course: new mongoose.Types.ObjectId(req.params.courseId) }),
  );
  const { docs, ...pagination } = await Group.aggregatePaginate(groupAggregate, {
    page,
    limit,
  });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of groups.',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of groups.');
};

const getById = async (req: Request, res: Response) => {
  const group = await Group.aggregate<GroupType>(
    getGroupPipeline({ _id: new mongoose.Types.ObjectId(req.params.groupId) }),
  );
  if (group.length) {
    return res.status(200).json({
      message: 'The group has been successfully found.',
      data: group[0],
      error: false,
    });
  }
  throw new CustomError(404, `Group with id ${req.params.groupId} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const groupByName = await Group.find({
    name: req.body.name,
    course: req.params.courseId,
    isActive: true,
  });
  if (groupByName.length) {
    throw new CustomError(404, `The group name: "${req.body.name}" already exist in this course.`);
  }

  // Validate if courseUsers are able to be in this group in this modules
  const courseUsers = await getCourseUsersExcludeByModules(
    new mongoose.Types.ObjectId(req.params.courseId),
    req.body.modules,
    {},
  );
  const courseUsersIds = courseUsers.docs.map((doc) => doc._id?.toString());
  const availableCourseUsers = req.body.courseUsers.every((id: string) =>
    courseUsersIds.includes(id),
  );
  if (!availableCourseUsers) {
    throw new CustomError(404, 'One or more of the courseUsers could not be on this group.');
  }
  const validCourseUsersRole = await validateAtLeastOneRole('TUTOR', req.body.courseUsers);
  if (!validCourseUsersRole) {
    throw new CustomError(404, 'At least one TUTOR is required in courseUsers.');
  }

  let newGroup: GroupIdType;
  try {
    const courseId = new mongoose.Types.ObjectId(req.params.courseId);
    const group = new Group<GroupType>({
      course: courseId,
      ...req.body,
    });
    newGroup = await group.save();
  } catch {
    throw new CustomError(404, 'There was an error during the creation of the group.');
  }
  try {
    const modules = await Module.find(filterIncludeArrayOfIds(req.body.modules));
    const modulesWithGroup: ModuleType[] = modules.map((module) => {
      const groups = [...module.groups, newGroup._id];
      const moduleWithGroup: ModuleType = {
        ...module.toObject(),
        groups,
      };
      return moduleWithGroup;
    });
    await Promise.all(
      modulesWithGroup.map(async (module) => {
        await Module.findByIdAndUpdate(module._id, module, {
          new: true,
        });
      }),
    );
  } catch {
    throw new CustomError(
      500,
      'There was an error during the update of the modules in the group creation.',
    );
  }
  return res.status(201).json({
    message: 'Group successfully created.',
    data: newGroup,
    error: false,
  });
};

const updateById = async (req: Request, res: Response) => {
  const groupByName = await Group.find({
    name: req.body.name,
    course: req.params.courseId,
    isActive: true,
  });
  if (groupByName.length) {
    throw new CustomError(404, `The group name: "${req.body.name}" already exist in this course.`);
  }
  const validCourseUsers = await validateAtLeastOneRole('TUTOR', req.body.courseUsers);
  if (!validCourseUsers) {
    throw new CustomError(404, 'At least one TUTOR is required in courseUsers.');
  }
  const updatedGroup = await Group.findByIdAndUpdate(
    req.params.groupId,
    { ...req.body, course: req.params.courseId },
    {
      new: true,
    },
  );
  if (updatedGroup) {
    return res.status(200).json({
      message: 'The group has been successfully updated.',
      data: updatedGroup,
      error: false,
    });
  }
  throw new CustomError(404, `Group with id ${req.params.groupId} was not found.`);
};

const deleteGroupFromModules = async (groupId: string) => {
  try {
    const modulesIncludeGroup = await Module.find({
      groups: { $in: groupId },
    });
    const modulesWithoutGroup: ModuleType[] = modulesIncludeGroup.map((module) => {
      const moduleWithoutGroup: ModuleType = {
        ...module.toObject(),
        groups: module.groups.filter((_id) => _id.toString() !== groupId),
      };
      return moduleWithoutGroup;
    });
    await Promise.all(
      modulesWithoutGroup.map(async (group) => {
        await Group.findByIdAndUpdate(group._id, group, {
          new: true,
        });
      }),
    );
    return true;
  } catch {
    return false;
  }
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const successDeleteFromModules = await deleteGroupFromModules(req.params.groupId);
  if (!successDeleteFromModules) {
    throw new CustomError(500, 'There was an error while deleting the group from the modules.');
  }
  const result = await Group.findByIdAndDelete(req.params.groupId);
  if (result) {
    return res.status(200).json({
      message: `The group with id ${req.params.groupId} has been successfully deleted.`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Group with id ${req.params.groupId} was not found.`);
};

const deleteById = async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.groupId);
  if (!group?.isActive) {
    throw new CustomError(400, 'This group has already been disabled.');
  }
  const result = await Group.findByIdAndUpdate(
    req.params.groupId,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result) {
    return res.status(200).json({
      message: 'The group has been successfully disabled.',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Group with id ${req.params.groupId} was not found.`);
};

const exportToCsv = async (req: Request, res: Response) => {
  const query = filterByIncludes(req.query);
  const docs = await Group.aggregate(
    exportGroupPipeline(query, new mongoose.Types.ObjectId(req.params.courseId)),
  );
  if (docs.length) {
    const csv = await parseAsync(docs, {
      //fields: ['_id', 'name', 'course', 'type', 'courseUsers', 'modules', 'isActive'],
      fields: [
        { value: '_id', label: 'group._id' },
        { value: 'name', label: 'group.name' },
        { value: 'type', label: 'group.type' },
        { value: 'isActive', label: 'group.isActive' },
        { value: 'courseUsers.user.postulant.firstName', label: 'firstName' },
        { value: 'courseUsers.user.postulant.lastName', label: 'lastName' },
        { value: 'courseUsers.user.email', label: 'email' },
        { value: 'courseUsers.role', label: 'role' },
        { value: 'modules._id', label: 'module._id' },
        { value: 'modules.name', label: 'module.name' },
        { value: 'modules.type', label: 'module.type' },
      ],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('groups.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'There are no groups to export');
};

export default { getAll, getById, create, updateById, physicalDeleteById, deleteById, exportToCsv };
