import mongoose, { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';

export const getGroupPipeline = (
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
      $project: {
        _id: 1,
        course: 1,
        name: 1,
        type: 1,
        modules: 1,
        courseUsers: 1,
        isActive: 1,
        tutor: '$tutor.user',
      },
    },
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};

export const exportGroupPipeline = (
  query: qs.ParsedQs | { [k: string]: unknown },
  courseId: mongoose.Types.ObjectId,
  sort?: SortType,
) => {
  const pipeline: PipelineStage[] = [
    { $match: { course: courseId } },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: {
        path: '$course',
      },
    },
    {
      $lookup: {
        from: 'courseusers',
        localField: 'courseUsers',
        foreignField: '_id',
        as: 'courseUsers',
      },
    },
    {
      $unwind: {
        path: '$courseUsers',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'courseUsers.user',
        foreignField: '_id',
        as: 'courseUsers.user',
      },
    },
    {
      $unwind: {
        path: '$courseUsers.user',
      },
    },
    {
      $lookup: {
        from: 'postulants',
        localField: 'courseUsers.user.postulant',
        foreignField: '_id',
        as: 'courseUsers.user.postulant',
      },
    },
    {
      $unwind: {
        path: '$courseUsers.user.postulant',
      },
    },
    {
      $lookup: {
        from: 'modules',
        localField: 'modules',
        foreignField: '_id',
        as: 'modules',
      },
    },
    {
      $unwind: {
        path: '$modules',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        type: 1,
        isActive: 1,
        'courseUsers.user': { email: 1, postulant: 1 },
        'courseUsers.role': 1,
        modules: {
          _id: 1,
          name: 1,
          contents: 1,
          status: 1,
          type: 1,
        },
      },
    },
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
