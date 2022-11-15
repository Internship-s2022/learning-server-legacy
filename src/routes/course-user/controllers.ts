import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import { ObjectId } from 'mongodb';

import Course from 'src/models/course';
import CourseUser, { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import User from 'src/models/user';
import { paginateAndFilterByIncludes } from 'src/utils/query';

const getUserBasedOnCoursePipeline = (query: qs.ParsedQs | { [k: string]: ObjectId }) => [
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },
  { $unwind: { path: '$user' } },
  {
    $lookup: {
      from: 'postulants',
      localField: 'user.postulant',
      foreignField: '_id',
      as: 'user.postulant',
    },
  },
  { $unwind: { path: '$user.postulant' } },
  { $match: query },
];

const geCourseBasedOnUserPipeline = (query: qs.ParsedQs | { [k: string]: ObjectId }) => [
  {
    $lookup: {
      from: 'courses',
      localField: 'course',
      foreignField: '_id',
      as: 'course',
    },
  },
  { $unwind: { path: '$course' } },
  { $match: query },
];

const getByCourseId = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  if (course) {
    const courseUser = await CourseUser.findOne({ course: courseId });
    if (courseUser) {
      const { page, limit, query } = paginateAndFilterByIncludes(req.query);
      const courseUserAggregate = CourseUser.aggregate(
        getUserBasedOnCoursePipeline({ ...query, course: new ObjectId(courseId) }),
      );
      const { docs, ...pagination } = await CourseUser.aggregatePaginate(courseUserAggregate, {
        page,
        limit,
      });
      return res.status(200).json({
        message: `The list of users and roles of the course with id: ${req.params.id} has been successfully found.`,
        data: docs,
        pagination,
        error: false,
      });
    }
    throw new CustomError(400, 'This course does not have any members.');
  }
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const getByUserId = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    const courseUser = await CourseUser.findOne({ user: userId });
    if (courseUser) {
      const { page, limit, query } = paginateAndFilterByIncludes(req.query);
      const courseUserAggregate = CourseUser.aggregate(
        geCourseBasedOnUserPipeline({ ...query, user: new ObjectId(userId) }),
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
  if (user && course) {
    const courseUser = await CourseUser.find({
      user: req.body.user,
      course: req.body.course,
    });
    if (courseUser.length) {
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
    if (!courseUser?.isActive) {
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
  const course = await Course.findById(req.params.id);
  if (course) {
    const docs = await CourseUser.aggregate(
      getUserBasedOnCoursePipeline({ course: new ObjectId(req.params.id) }),
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
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const exportToCsvByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const docs = await CourseUser.aggregate(
      geCourseBasedOnUserPipeline({ user: new ObjectId(req.params.id) }),
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
  throw new CustomError(404, `User with id ${req.params.id} was not found.`);
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
};
