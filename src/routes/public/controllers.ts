import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import { paginateAndFilter } from 'src/utils/query';

import { getCoursePipeline } from './aggregations';

const getCourses = async (req: Request, res: Response) => {
  const { query, sort } = paginateAndFilter(req.query);
  const courseAggregate = Course.aggregate(getCoursePipeline(query, sort));
  const { docs } = await Course.aggregatePaginate(courseAggregate);
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of courses.',
      data: docs,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of courses.');
};

const getCourseById = async (req: Request, res: Response) => {
  const course = await Course.aggregate(
    getCoursePipeline({ _id: new mongoose.Types.ObjectId(req.params.courseId) }),
  );

  if (course.length) {
    return res.status(200).json({
      message: 'The course has been successfully found.',
      data: course[0],
      error: false,
    });
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

export default { getCourses, getCourseById };
