import { PipelineStage } from 'mongoose';

export const getModulePipeline = (query: qs.ParsedQs | { [k: string]: unknown }) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'groups',
        localField: 'groups',
        foreignField: '_id',
        as: 'groups',
      },
    },
    { $match: query },
  ];

  return pipeline;
};
