import { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';

export const getCoursePipeline = (query: qs.ParsedQs, sort?: SortType) => {
  const pipeline: PipelineStage[] = [
    {
      $addFields: {
        status: {
          $switch: {
            branches: [
              {
                case: {
                  $gte: ['$inscriptionStartDate', '$$NOW'],
                },
                then: 'SOON',
              },
              {
                case: {
                  $and: [
                    { $lt: ['$inscriptionStartDate', '$$NOW'] },
                    { $gte: ['$inscriptionEndDate', '$$NOW'] },
                  ],
                },
                then: 'OPEN_INSCRIPTION',
              },
              {
                case: {
                  $and: [{ $lt: ['$startDate', '$$NOW'] }, { $gte: ['$endDate', '$$NOW'] }],
                },
                then: 'IN_PROGRESS',
              },
            ],
            default: 'COMPLETED',
          },
        },
      },
    },
    { $match: { ...query, status: 'OPEN_INSCRIPTION', isInternal: false } },
    { $project: { isInternal: 0 } },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
