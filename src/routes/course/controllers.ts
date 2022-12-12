import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';

import AdmissionTest from 'src/models/admission-test';
import Course, { CourseDocument, CourseType, CourseWithUsers } from 'src/models/course';
import CourseUser from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import User from 'src/models/user';
import { createDefaultRegistrationForm } from 'src/utils/default-registration-form';
import {
  filterByIncludes,
  filterIncludeArrayOfIds,
  paginateAndFilterByIncludes,
} from 'src/utils/query';

import { getCoursePipeline } from './aggregations';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const courseAggregate = Course.aggregate(getCoursePipeline(query));
  const { docs, ...pagination } = await Course.aggregatePaginate(courseAggregate, {
    page,
    limit,
  });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of courses.',
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
      message: 'The course has been successfully found.',
      data: course,
      error: false,
    });
  }
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const create = async (
  req: Request<Record<string, string>, unknown, CourseWithUsers>,
  res: Response,
) => {
  const courseName = await Course.findOne({ name: req.body.name, isActive: true });
  if (courseName?.name) {
    throw new CustomError(400, `An course with name ${req.body.name} already exists.`);
  }

  let newCourse: CourseDocument;
  try {
    const course = new Course<CourseType>({
      name: req.body.name,
      admissionTests: [],
      description: req.body.description,
      inscriptionStartDate: req.body.inscriptionStartDate,
      inscriptionEndDate: req.body.inscriptionEndDate,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      type: req.body.type,
      isInternal: req.body.isInternal,
      isActive: req.body.isActive,
    });
    newCourse = await course.save();
  } catch {
    throw new CustomError(500, 'There was an error during the creation of the course.');
  }

  await createDefaultRegistrationForm(newCourse._id);

  const existingUsers = await User.find(
    filterIncludeArrayOfIds(req.body.courseUsers.map((cUser) => cUser.user.toString())),
  );
  if (existingUsers?.length !== req.body.courseUsers.length) {
    throw new CustomError(400, 'Some of the users dont exist.');
  }

  const courseUsers = req.body.courseUsers?.map((e) => ({
    course: newCourse?._id,
    user: e.user,
    role: e.role,
    isActive: e.isActive,
  }));

  try {
    CourseUser.insertMany(courseUsers);
    return res.status(201).json({
      message: 'Course with users successfully created.',
      data: { ...newCourse.toObject(), courseUsers },
      error: false,
    });
  } catch {
    await Course.findByIdAndDelete(newCourse._id);
    throw new CustomError(500, 'There was an error during the creation of user in the course.');
  }
};

const update = async (
  req: Request<Record<string, string>, unknown, CourseWithUsers>,
  res: Response,
) => {
  const courseName = await Course.findOne({ name: req.body.name, isActive: true });
  if (courseName?.name && courseName?._id.toString() !== req.params.id) {
    throw new CustomError(400, `An course with name ${req.body.name} already exists.`);
  }
  if (req.body.courseUsers?.length) {
    const existingUsers = await User.find(
      filterIncludeArrayOfIds(req.body.courseUsers?.map((cUser) => cUser.user.toString())),
    );
    if (existingUsers?.length !== req.body.courseUsers?.length) {
      throw new CustomError(400, 'Some of the users dont exist.');
    }
  }

  if (req.body.admissionTests?.length) {
    const existingAdmissionTests = await AdmissionTest.find(
      filterIncludeArrayOfIds(req.body.admissionTests?.map((aTest) => aTest.toString())),
    );
    if (existingAdmissionTests?.length !== req.body.admissionTests.length) {
      throw new CustomError(400, 'Some of the admission tests dont exist.');
    }
  }
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    isActive: true,
  }).populate({ path: 'admissionTests' });
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
  if (course?.isActive === false) {
    throw new CustomError(400, 'This course has already been disabled.');
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
      message: 'The course has been successfully disabled.',
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
      message: `The course with id ${req.params.id} has been successfully deleted.`,
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
  throw new CustomError(404, 'There are no courses to export.');
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
