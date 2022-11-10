import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import { PipelineStage } from 'mongoose';

import { ResponseBody } from 'src/interfaces/response';
import Course, { CourseType, CourseWithUsers } from 'src/models/course';
import CourseUser, { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import { filterByIncludes, paginateAndFilterByIncludes } from 'src/utils/query';

const getCoursePipeline = (query: qs.ParsedQs, options?: { [k: string]: boolean }) => {
  const pipeline: PipelineStage[] = [
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

  return pipeline;
};

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const courseAggregate = Course.aggregate(getCoursePipeline(query));
  const { docs, ...pagination } = await Course.aggregatePaginate(courseAggregate, {
    page,
    limit,
  });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of courses',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of courses.');
};

const getById = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id).populate({ path: 'admissionTests' });
  if (course) {
    return res.status(200).json({
      message: 'The course has been successfully found',
      data: course,
      error: false,
    });
  }
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const create = async (
  req: Request<Record<string, string>, unknown, CourseWithUsers>,
  res: Response<ResponseBody<CourseWithUsers>>,
) => {
  try {
    const course = new Course<CourseWithUsers>({
      name: req.body.name,
      admissionTests: req.body.admissionTests,
      description: req.body.description,
      inscriptionStartDate: req.body.inscriptionStartDate,
      inscriptionEndDate: req.body.inscriptionEndDate,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      type: req.body.type,
      isInternal: req.body.isInternal,
      isActive: req.body.isActive,
    });
    await course.save();
    CourseUser.insertMany(
      req.body.courseUsers?.map((e) => ({
        course: course._id,
        user: e.user,
        role: e.role,
        isActive: e.isActive,
      })),
    );
    return res.status(201).json({
      message: 'Course successfully created.',
      data: course,
      error: false,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'error',
      data: error,
      error: true,
    });
  }
};

const update = async (req: Request, res: Response) => {
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updatedCourse) {
    return res.status(200).json({
      message: 'The course has been successfully updated.',
      data: updatedCourse,
      error: false,
    });
  }
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const deleteById = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);
  if (!course?.isActive) {
    throw new CustomError(404, 'Course has already been deleted');
  }
  const result = await Course.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result) {
    return res.status(200).json({
      message: 'The course has been successfully deleted',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const result = await Course.findByIdAndDelete(req.params.id);
  if (result) {
    return res.status(200).json({
      message: `The course with id ${req.params.id} has been successfully deleted`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const exportToCsv = async (req: Request, res: Response) => {
  const query = filterByIncludes(req.query);
  const docs = await Course.aggregate(getCoursePipeline(query, { unwindAdmissionTest: true }));
  if (docs.length) {
    const csv = await parseAsync(docs, {
      fields: [
        '_id',
        'name',
        'description',
        'inscriptionStartDate',
        'inscriptionEndDate',
        'startDate',
        'endDate',
        'type',
        'isInternal',
        'isActive',
        'admissionTests._id',
        'admissionTests.name',
        'admissionTests.isActive',
      ],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('courses.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'Cannot export the list of courses.');
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
  physicalDeleteById,
  exportToCsv,
};
