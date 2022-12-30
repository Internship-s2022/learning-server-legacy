import mongoose, { PipelineStage } from 'mongoose';

export const getUserBasedOnCoursePipeline = (
  query: qs.ParsedQs | { [k: string]: unknown },
  sort?: Record<string, 1 | -1> | undefined,
) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user' } },
    {
      $lookup: {
        from: 'postulants',
        localField: 'user.postulant',
        foreignField: '_id',
        as: 'user.postulant',
      },
    },
    { $unwind: { path: '$user.postulant' } },
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};

export const getCourseBasedOnUserPipeline = (
  query: qs.ParsedQs | { [k: string]: mongoose.Types.ObjectId },
  sort?: Record<string, 1 | -1> | undefined,
) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: { path: '$course' } },
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
