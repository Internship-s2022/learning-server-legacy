import mongoose, { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';

export const getModulePipeline = (
  query: qs.ParsedQs | { [k: string]: unknown },
  sort?: SortType,
) => {
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

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};

export const getModulesByGroupId = (
  query: qs.ParsedQs | { [k: string]: mongoose.Types.ObjectId },
  modulesIds: string[],
  sort?: SortType,
) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        ...query,
        $or: modulesIds.map((id) => ({ modules: { $in: [new mongoose.Types.ObjectId(id)] } })),
      },
    },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
