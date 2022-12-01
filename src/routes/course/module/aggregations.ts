import mongoose, { PipelineStage } from 'mongoose';

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

export const getModulesByGroupId = (
  query: qs.ParsedQs | { [k: string]: mongoose.Types.ObjectId },
  modulesIds: string[],
) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        ...query,
        $or: modulesIds.map((id) => ({ modules: { $in: [new mongoose.Types.ObjectId(id)] } })),
      },
    },
  ];

  return pipeline;
};
