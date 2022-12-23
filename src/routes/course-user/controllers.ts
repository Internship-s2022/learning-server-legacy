import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import mongoose from 'mongoose';

import Course from 'src/models/course';
import CourseUser, { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import User from 'src/models/user';
import { formatFilters, formatSort, paginateAndFilter } from 'src/utils/query';
import { getCourseUsersExcludeByModules } from 'src/utils/validate-course-users';

import { getCourseBasedOnUserPipeline, getUserBasedOnCoursePipeline } from './aggregations';

const getByCourseId = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (course) {
    const courseUser = await CourseUser.findOne({ course: courseId });
    if (courseUser) {
      const { page, limit, query, sort } = paginateAndFilter(req.query);
      const courseUserAggregate = CourseUser.aggregate(
        getUserBasedOnCoursePipeline(
          { ...query, course: new mongoose.Types.ObjectId(courseId) },
          sort,
        ),
      );
      const { docs, ...pagination } = await CourseUser.aggregatePaginate(courseUserAggregate, {
        page,
        limit,
      });
      return res.status(200).json({
        message: `The list of users and roles of the course with id: ${req.params.courseId} has been successfully found.`,
        data: docs,
        pagination,
        error: false,
      });
    }
    throw new CustomError(400, 'This course does not have any members.');
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

const getByUserId = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    const courseUser = await CourseUser.findOne({ user: userId });
    if (courseUser) {
      const { page, limit, query, sort } = paginateAndFilter(req.query);
      const courseUserAggregate = CourseUser.aggregate(
        getCourseBasedOnUserPipeline({ ...query, user: new mongoose.Types.ObjectId(userId) }, sort),
      );
      const { docs, ...pagination } = await CourseUser.aggregatePaginate(courseUserAggregate, {
        page,
        limit,
      });
      return res.status(200).json({
        message: `The list of courses and roles of the user with id: ${req.params.id} has been successfully found.`,
        data: docs,
        pagination,
        error: false,
      });
    }
    throw new CustomError(400, 'This user does not belong to any course.');
  }
  throw new CustomError(404, `User with id ${req.params.id} was not found.`);
};

const assignRole = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.user);
  const course = await Course.findById(req.body.course);
  if (course?.isInternal && !user?.isInternal) {
    throw new CustomError(
      404,
      'It is not posible to create an external student on an internal course.',
    );
  }
  if (user && course) {
    const courseUser = await CourseUser.findOne({
      user: req.body.user,
      course: req.body.course,
    });
    if (courseUser) {
      if (!courseUser.isActive && courseUser.role !== 'STUDENT') {
        const updatedCourseUser = await CourseUser.findByIdAndUpdate(
          courseUser._id,
          {
            user: req.body.user,
            course: req.body.course,
            role: req.body.role,
            isActive: req.body.isActive,
          },
          { new: true },
        );
        return res.status(200).json({
          message: 'Role successfully assigned.',
          data: updatedCourseUser,
          error: false,
        });
      }
      throw new CustomError(
        400,
        `The user with id: ${req.body.user} already has a role in this course.`,
      );
    }
    const NewCourseUser = new CourseUser<CourseUserType>({
      course: req.body.course,
      user: req.body.user,
      role: req.body.role,
      isActive: req.body.isActive,
    });
    await NewCourseUser.save();
    return res.status(201).json({
      message: 'Role successfully assigned.',
      data: NewCourseUser,
      error: false,
    });
  } else {
    throw new CustomError(404, 'The user or course does not exist.');
  }
};

const updateByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  const course = await Course.findById(req.body.course);
  if (course?.isInternal && !user?.isInternal) {
    throw new CustomError(
      404,
      'It is not posible to create an external student on an internal course.',
    );
  }
  if (user && course) {
    const courseUser = await CourseUser.findOne({
      user: req.params.id,
      course: req.body.course,
    });
    if (courseUser) {
      const updatedCourseUser = await CourseUser.findOneAndUpdate(
        courseUser._id,
        {
          user: req.params.id,
          course: req.body.course,
          role: req.body.role,
          isActive: req.body.isActive,
        },
        {
          new: true,
        },
      );
      return res.status(200).json({
        message: 'The role has been successfully edited.',
        data: updatedCourseUser,
        error: false,
      });
    }
    throw new CustomError(400, `User with id ${req.params.id} does not have a rol in this course.`);
  } else {
    if (!user?._id) {
      throw new CustomError(404, `User with id ${req.params.id} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.body.course} was not found.`);
  }
};

const disableByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.user);
  const course = await Course.findById(req.body.course);
  if (user && course) {
    const courseUser = await CourseUser.findOne({
      user: req.body.user,
      course: req.body.course,
    });
    if (courseUser?.isActive === false) {
      throw new CustomError(400, 'This user has already been disabled from the course.');
    }
    if (courseUser) {
      const result = await CourseUser.findByIdAndUpdate(
        courseUser._id,
        { isActive: false },
        {
          new: true,
        },
      );
      if (result) {
        return res.status(200).json({
          message: 'The user has been successfully disabled.',
          data: result,
          error: false,
        });
      }
    }
    throw new CustomError(400, `User with id ${req.body.user} does not have a rol in this course.`);
  } else {
    if (!user?._id) {
      throw new CustomError(404, `User with id ${req.body.user} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.body.course} was not found.`);
  }
};

const physicalDeleteByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.user);
  const course = await Course.findById(req.body.course);
  if (user && course) {
    const result = await CourseUser.findOneAndDelete({
      user: req.body.user,
      course: req.body.course,
    });
    if (result) {
      return res.status(200).json({
        message: 'The course-user been successfully deleted.',
        data: result,
        error: false,
      });
    }
    throw new CustomError(400, `User with id ${req.body.user} does not have a rol in this course.`);
  } else {
    if (!user?._id) {
      throw new CustomError(404, `User with id ${req.body.user} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.body.course} was not found.`);
  }
};

const exportToCsvByCourseId = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const { sort, ...rest } = req.query;
    const query = formatFilters(rest);
    const docs = await CourseUser.aggregate<CourseUserType>(
      getUserBasedOnCoursePipeline(
        { ...query, course: new mongoose.Types.ObjectId(req.params.courseId) },
        formatSort(sort),
      ),
    );
    if (docs.length) {
      const csv = await parseAsync(docs, {
        fields: [
          '_id',
          'course',
          'role',
          'isActive',
          'user._id',
          'user.isInternal',
          'user.isActive',
          'user.postulant.firstName',
          'user.postulant.lastName',
          'user.postulant.email',
          'user.postulant.phone',
          'user.postulant.location',
          'user.postulant.birthDate',
          'user.postulant.dni',
        ],
      });
      if (csv) {
        res.set('Content-Type', 'text/csv');
        res.attachment('course-users-by-course.csv');
        return res.status(200).send(csv);
      }
    }
    throw new CustomError(400, 'This course does not have any members.');
  }
  throw new CustomError(404, `There are no course with id ${req.params.courseId} to export.`);
};

const exportToCsvByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const { sort, ...rest } = req.query;
    const query = formatFilters(rest);
    const docs = await CourseUser.aggregate<CourseUserType>(
      getCourseBasedOnUserPipeline(
        { ...query, user: new mongoose.Types.ObjectId(req.params.id) },
        formatSort(sort),
      ),
    );
    if (docs.length) {
      const csv = await parseAsync(docs, {
        fields: [
          '_id',
          'role',
          'isActive',
          'course._id',
          'course.name',
          'course.inscriptionStartDate',
          'course.inscriptionEndDate',
          'course.startDate',
          'course.endDate',
          'course.type',
          'course.description',
          'course.isInternal',
          'course.isActive',
        ],
      });
      if (csv) {
        res.set('Content-Type', 'text/csv');
        res.attachment('course-users-by-user.csv');
        return res.status(200).send(csv);
      }
    }
    throw new CustomError(400, 'This user does not belong to any course.');
  }
  throw new CustomError(404, `There are no course user with id ${req.params.id} to export.`);
};

const getWithoutGroup = async (req: Request, res: Response) => {
  delete req.query.modules;
  const courseUsers = await getCourseUsersExcludeByModules(
    new mongoose.Types.ObjectId(req.params.courseId),
    req.body.modules,
    req.query,
  );
  if (!courseUsers.docs.length) {
    throw new CustomError(
      404,
      'CourseUsers without an assigned group on this modules has not been found.',
    );
  }
  return res.status(200).json({
    message: 'List with courseUsers without an assigned group on this modules has been found.',
    data: courseUsers.docs,
    pagination: courseUsers.pagination,
    error: false,
  });
};

export default {
  getByCourseId,
  getByUserId,
  assignRole,
  updateByUserId,
  disableByUserId,
  physicalDeleteByUserId,
  exportToCsvByCourseId,
  exportToCsvByUserId,
  getWithoutGroup,
};
