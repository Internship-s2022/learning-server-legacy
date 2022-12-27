import { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';

export const getReportPipeline = (
  query: qs.ParsedQs | { [k: string]: unknown },
  sort?: SortType,
) => {
  const pipeline: PipelineStage[] = [
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
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};

export const getHistoryPipeline = (
  query: qs.ParsedQs | { [k: string]: unknown },
  sort?: SortType,
) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'courseusers',
        localField: 'courseUsers',
        foreignField: '_id',
        as: 'courseUsers',
      },
    },
    {
      $addFields: {
        tutor: {
          $filter: {
            input: '$courseUsers',
            as: 'courseUser',
            cond: { $eq: ['$$courseUser.role', 'TUTOR'] },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'tutor.user',
        foreignField: '_id',
        as: 'tutor.user',
      },
    },
    { $unwind: { path: '$tutor.user' } },
    {
      $lookup: {
        from: 'postulants',
        localField: 'tutor.user.postulant',
        foreignField: '_id',
        as: 'tutor.user.postulant',
      },
    },
    { $unwind: { path: '$tutor.user.postulant' } },
    {
      $lookup: {
        from: 'modules',
        localField: 'modules',
        foreignField: '_id',
        as: 'module',
      },
    },
    { $unwind: { path: '$module' } },
    { $match: query },
    {
      $project: {
        _id: 1,
        course: 1,
        name: 1,
        type: 1,
        module: {
          _id: 1,
          name: 1,
        },
        isActive: 1,
        tutor: '$tutor.user',
      },
    },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
