import { ObjectId } from 'mongodb';
import { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';

export const getPostulantBasedOnCoursePipeline = (
  query: qs.ParsedQs | { [k: string]: ObjectId },
  corrected?: boolean,
  sort?: SortType,
) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'admissionresults',
        localField: 'admissionResults',
        foreignField: '_id',
        as: 'admissionResults',
      },
    },
    {
      $unwind: {
        path: '$admissionResults',
      },
    },

    {
      $lookup: {
        from: 'admissiontests',
        localField: 'admissionResults.admissionTest',
        foreignField: '_id',
        as: 'admissionResults.admissionTest',
      },
    },
    {
      $unwind: {
        path: '$admissionResults.admissionTest',
      },
    },
    {
      $group: {
        _id: '$_id',
        admissionResults: {
          $push: '$admissionResults',
        },
      },
    },
    {
      $lookup: {
        from: 'postulantcourses',
        localField: '_id',
        foreignField: '_id',
        as: 'newField',
      },
    },
    {
      $unwind: {
        path: '$newField',
      },
    },
    {
      $addFields: {
        'newField.admissionResults': '$admissionResults',
      },
    },
    {
      $replaceRoot: {
        newRoot: '$newField',
      },
    },
    {
      $lookup: {
        from: 'postulants',
        localField: 'postulant',
        foreignField: '_id',
        as: 'postulant',
      },
    },
    { $unwind: { path: '$postulant' } },
    {
      $addFields: {
        'postulant.age': {
          $dateDiff: {
            startDate: {
              $dateFromString: {
                dateString: '$postulant.birthDate',
              },
            },
            endDate: '$$NOW',
            unit: 'year',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: { path: '$course' } },
    {
      $project: {
        'admissionResults.__v': 0,
        'admissionResults.createdAt': 0,
        'admissionResults.updatedAt': 0,
      },
    },
    corrected
      ? {
          $match: {
            ...query,
            isPromoted: false,
            admissionResults: { $not: { $elemMatch: { score: 0 } } },
          },
        }
      : {
          $match: {
            ...query,
            isPromoted: false,
            admissionResults: { $elemMatch: { score: 0 } },
          },
        },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};
