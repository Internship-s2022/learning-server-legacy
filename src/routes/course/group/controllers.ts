import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import _ from 'lodash';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';
import Group, { GroupIdType, GroupType } from 'src/models/group';
import Module, { ModuleType } from 'src/models/module';
import { createReports, deleteReportsByGroupId } from 'src/routes/course/report/controllers';
import {
  filterIncludeArrayOfIds,
  formatFilters,
  formatSort,
  paginateAndFilter,
} from 'src/utils/query';
import { getCourseUsersExcludeByModules } from 'src/utils/validate-course-users';
import { validateAtLeastOneRole } from 'src/utils/validate-role';

import { exportGroupPipeline, getGroupPipeline } from './aggregations';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query, sort } = paginateAndFilter(req.query);
  const groupAggregate = Group.aggregate(
    getGroupPipeline({ ...query, course: new mongoose.Types.ObjectId(req.params.courseId) }, sort),
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

  const modules = await Module.find(filterIncludeArrayOfIds(req.body.modules));
  if (modules.length !== req.body.modules.length) {
    throw new CustomError(404, 'One or more of the of the modules do not exist.');
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
    throw new CustomError(
      404,
      'One or more courseUsers do not exist or are already assigned to another group.',
    );
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
  const reportsCreated = await createReports(req.body.courseUsers, req.body.modules);
  if (!reportsCreated) {
    throw new CustomError(500, 'There was an error creating the reports for this group.');
  }
  return res.status(201).json({
    message: 'Group successfully created.',
    data: newGroup,
    error: false,
  });
};

const deleteGroupFromModules = async (groupId: string, modulesIdsToDeleteFrom: string[] = []) => {
  try {
    const modules = await Module.find(
      modulesIdsToDeleteFrom.length > 0
        ? filterIncludeArrayOfIds(modulesIdsToDeleteFrom)
        : { groups: { $in: groupId } },
    );
    const modulesWithoutGroup: ModuleType[] = modules.map((module) => ({
      ...module.toObject(),
      groups: module.groups.filter((_id) => _id.toString() !== groupId),
    }));
    await Promise.all(
      modulesWithoutGroup.map(async ({ _id, ...rest }) => {
        await Module.findByIdAndUpdate(_id, rest, {
          new: true,
        });
      }),
    );
    return true;
  } catch {
    return false;
  }
};

const addGroupToModules = async (groupId: string, modulesIdsToAddTo: string[]) => {
  try {
    const modules = await Module.find(filterIncludeArrayOfIds(modulesIdsToAddTo));
    const modulesWithGroup: ModuleType[] = modules.map((module) => ({
      ...module.toObject(),
      groups: [...module.groups, new mongoose.Types.ObjectId(groupId)],
    }));
    await Promise.all(
      modulesWithGroup.map(async ({ _id, ...rest }) => {
        await Module.findByIdAndUpdate(_id, rest, {
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
  const groupId = req.params.groupId;

  const groupByName = await Group.find({
    name: req.body.name,
    course: req.params.courseId,
    isActive: true,
  });

  if (groupByName.length && groupByName[0]._id.toString() !== groupId) {
    throw new CustomError(404, `The group name: "${req.body.name}" already exist in this course.`);
  }
  const validCourseUsers = await validateAtLeastOneRole('TUTOR', req.body.courseUsers);
  if (!validCourseUsers) {
    throw new CustomError(404, 'At least one TUTOR is required in courseUsers.');
  }

  const modulesIdsInBody: string[] = req.body?.modules;
  const modulesInBody = await Module.find(filterIncludeArrayOfIds(modulesIdsInBody));

  if (modulesIdsInBody.length !== modulesInBody.length) {
    throw new CustomError(404, 'One or more of the the modules do not exist.');
  }

  const group = await Group.findById(groupId);

  const modulesIdsInGroup: string[] = group
    ? group?.modules.map((module) => module._id.toString())
    : [];

  const modulesIdsToDeleteFrom = _.difference(modulesIdsInGroup, modulesIdsInBody);
  const modulesIdsToAddTo = _.difference(modulesIdsInBody, modulesIdsInGroup);

  if (modulesIdsToDeleteFrom.length) {
    const successDeleteFromGroups = await deleteGroupFromModules(groupId, modulesIdsToDeleteFrom);
    if (!successDeleteFromGroups) {
      throw new CustomError(500, 'There was an error while deleting the group from the modules.');
    }
  }

  if (modulesIdsToAddTo.length) {
    const successAddToGroups = await addGroupToModules(groupId, modulesIdsToAddTo);
    if (!successAddToGroups) {
      throw new CustomError(500, 'There was an error while adding the group to the modules.');
    }
  }

  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
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
  throw new CustomError(404, `Group with id ${groupId} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const successDeleteFromModules = await deleteGroupFromModules(req.params.groupId);
  if (!successDeleteFromModules) {
    throw new CustomError(500, 'There was an error while deleting the group from the modules.');
  }
  const successDeleteReports = await deleteReportsByGroupId(req.params.groupId);
  if (!successDeleteReports) {
    throw new CustomError(500, 'There was an error while deleting the reports of this group.');
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
  const successDeleteFromModules = await deleteGroupFromModules(req.params.groupId);
  if (!successDeleteFromModules) {
    throw new CustomError(500, 'There was an error while deleting the group from the modules.');
  }
  const group = await Group.findById(req.params.groupId);
  if (!group?.isActive) {
    if (!group) {
      throw new CustomError(404, `Group with id ${req.params.groupId} was not found.`);
    }
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
};

const exportToCsv = async (req: Request, res: Response) => {
  const { sort, ...rest } = req.query;
  const query = formatFilters(rest);
  const docs = await Group.aggregate(
    exportGroupPipeline(query, new mongoose.Types.ObjectId(req.params.courseId), formatSort(sort)),
  );
  if (docs.length) {
    const csv = await parseAsync(docs, {
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
