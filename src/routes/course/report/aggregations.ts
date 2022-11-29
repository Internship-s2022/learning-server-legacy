import { PipelineStage } from 'mongoose';

export const getReportPipeline = (query: qs.ParsedQs | { [k: string]: unknown }) => {
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
    {
      $project: {
        _id: 1,
        module: 1,
        courseUser: 1,
        exams: 1,
        assistance: 1,
      },
    },
    { $match: query },
  ];

  return pipeline;
};
