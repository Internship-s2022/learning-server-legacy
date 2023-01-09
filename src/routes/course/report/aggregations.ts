import mongoose, { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';
import { ModuleType } from 'src/models/module';

export const getReportPipeline = (
  query: qs.ParsedQs | { [k: string]: unknown },
  sort?: SortType,
  options: {
    startStages: PipelineStage[];
    endStages: PipelineStage[];
    populateModules: boolean;
  } = {
    populateModules: true,
    startStages: [],
    endStages: [],
  },
) => {
  const populateModulePipeline = [
    {
      $lookup: {
        from: 'modules',
        localField: 'module',
        foreignField: '_id',
        as: 'module',
      },
    },
    {
      $unwind: {
        path: '$module',
      },
    },
  ];

  const pipeline: PipelineStage[] = [
    ...options.startStages,
    ...(options.populateModules ? populateModulePipeline : []),
    {
      $lookup: {
        from: 'courseusers',
        localField: 'courseUser',
        foreignField: '_id',
        as: 'courseUser',
      },
    },
    {
      $unwind: {
        path: '$courseUser',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'courseUser.user',
        foreignField: '_id',
        as: 'courseUser.user',
      },
    },
    {
      $unwind: {
        path: '$courseUser.user',
      },
    },
    {
      $lookup: {
        from: 'postulants',
        localField: 'courseUser.user.postulant',
        foreignField: '_id',
        as: 'courseUser.user.postulant',
      },
    },
    {
      $unwind: {
        path: '$courseUser.user.postulant',
      },
    },
    ...options.endStages,
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};

export const getByStudentIdAndModuleId = (
  studentIds: string[] | qs.ParsedQs[],
  modulesInCourse: ModuleType[],
) => {
  const studentStage =
    studentIds.length === 1
      ? { courseUser: new mongoose.Types.ObjectId(studentIds[0].toString()) }
      : {
          courseUser: {
            $in: studentIds.map((id) => new mongoose.Types.ObjectId(id.toString())),
          },
        };

  const pipeline: PipelineStage[] = [
    {
      $match: {
        $or: modulesInCourse.map((module) => ({
          module: module._id,
        })),
      },
    },
    {
      $match: studentIds.length ? studentStage : {},
    },
  ];

  return pipeline;
};

export const getGroupByStudentStages = (modulesInCourse: ModuleType[]) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        $or: modulesInCourse.map((module) => ({
          module: module._id,
        })),
      },
    },
    {
      $group: {
        _id: '$courseUser',
        reports: {
          $push: {
            _id: '$_id',
            module: '$module',
            exams: '$exams',
            assistance: '$assistance',
          },
        },
      },
    },
    {
      $project: {
        _id: '$_id._id',
        student: '$_id',
        reports: 1,
      },
    },
  ];

  return pipeline;
};
