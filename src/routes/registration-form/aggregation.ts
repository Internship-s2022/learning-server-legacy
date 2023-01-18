import { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';

export const getRegistrationFormPipeline = (query: qs.ParsedQs, sort?: SortType) => {
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
