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
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
