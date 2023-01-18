import { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';

export const getCoursePipeline = (
  query: qs.ParsedQs,
  options?: { [k: string]: boolean },
  sort?: SortType,
) => {
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
    {
      $lookup: {
        from: 'admissiontests',
        localField: 'admissionTests',
        foreignField: '_id',
        as: 'admissionTests',
      },
    },
    { $match: query },
  ];

  if (options?.unwindAdmissionTest) {
    pipeline.push({ $unwind: { path: '$admissionTests' } });
  }

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
