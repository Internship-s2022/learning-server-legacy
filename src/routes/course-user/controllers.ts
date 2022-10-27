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
      localField: 'userId',
      foreignField: '_id',
      as: 'userId',
    },
  },
  { $unwind: { path: '$userId' } },
  {
    $lookup: {
      from: 'postulants',
      localField: 'userId.postulantId',
      foreignField: '_id',
      as: 'userId.postulantId',
    },
  },
  { $unwind: { path: '$userId.postulantId' } },
  { $match: query },
];

const geCourseBasedOnUserPipeline = (query: qs.ParsedQs | { [k: string]: ObjectId }) => [
  {
    $lookup: {
      from: 'courses',
      localField: 'courseId',
      foreignField: '_id',
      as: 'courseId',
    },
  },
  { $unwind: { path: '$courseId' } },
  { $match: query },
];

const getByCourseId = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  if (course) {
    const courseUser = await CourseUser.findOne({ courseId });
    if (courseUser) {
      const { page, limit, query } = paginateAndFilterByIncludes(req.query);
      const courseUserAggregate = CourseUser.aggregate(
        getUserBasedOnCoursePipeline({ ...query, courseId: new ObjectId(courseId) }),
      );
      const { docs, ...pagination } = await CourseUser.aggregatePaginate(courseUserAggregate, {
        page,
        limit,
      });
      return res.status(200).json({
        message: `The list of users and roles of the course with id: ${req.params.id} has been successfully found`,
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
    const courseUser = await CourseUser.findOne({ userId });
    if (courseUser) {
      const { page, limit, query } = paginateAndFilterByIncludes(req.query);
      const courseUserAggregate = CourseUser.aggregate(
        geCourseBasedOnUserPipeline({ ...query, userId: new ObjectId(userId) }),
      );
      const { docs, ...pagination } = await CourseUser.aggregatePaginate(courseUserAggregate, {
        page,
        limit,
      });
      return res.status(200).json({
        message: `The list of courses and roles of the user with id: ${req.params.id} has been successfully found`,
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
  const user = await User.findById(req.body.userId);
  const course = await Course.findById(req.body.courseId);
  if (user && course) {
    const courseUser = await CourseUser.find({
      userId: req.body.userId,
      courseId: req.body.courseId,
    });
    if (courseUser.length) {
      throw new CustomError(
        400,
        `The user with id: ${req.body.userId} has already a role in this course.`,
      );
    }
    const NewCourseUser = new CourseUser<CourseUserType>({
      courseId: req.body.courseId,
      userId: req.body.userId,
      role: req.body.role,
      isActive: req.body.isActive,
    });
    await NewCourseUser.save();
    return res.status(201).json({
      message: 'Role successfully assigned',
      data: NewCourseUser,
      error: false,
    });
  } else {
    throw new CustomError(404, 'The user or course does not exist');
  }
};

const updateByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  const course = await Course.findById(req.body.courseId);
  if (user && course) {
    const courseUser = await CourseUser.findOne({
      userId: req.params.id,
      courseId: req.body.courseId,
    });
    if (courseUser) {
      const updatedCourseUser = await CourseUser.findOneAndUpdate(
        courseUser._id,
        {
          userId: req.params.id,
          courseId: req.body.courseId,
          role: req.body.role,
          isActive: req.body.isActive,
        },
        {
          new: true,
        },
      );
      return res.status(200).json({
        message: 'The role has been successfully edited',
        data: updatedCourseUser,
        error: false,
      });
    }
    throw new CustomError(400, `User with id ${req.params.id} does not have a rol in this course.`);
  } else {
    if (!user?._id) {
      throw new CustomError(404, `User with id ${req.params.id} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.body.courseId} was not found.`);
  }
};

const disableByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  const course = await Course.findById(req.body.courseId);
  if (user && course) {
    const courseUser = await CourseUser.findOne({
      userId: req.params.id,
      courseId: req.body.courseId,
    });
    if (courseUser?.isActive === false) {
      throw new CustomError(404, 'The user has already been disabled');
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
          message: 'The user has been successfully disabled',
          data: result,
          error: false,
        });
      }
    }
    throw new CustomError(400, `User with id ${req.params.id} does not have a rol in this course.`);
  } else {
    if (!user?._id) {
      throw new CustomError(404, `User with id ${req.params.id} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.body.courseId} was not found.`);
  }
};

const exportToCsvByCourseId = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);
  if (course) {
    const docs = await CourseUser.aggregate(
      getUserBasedOnCoursePipeline({ courseId: new ObjectId(req.params.id) }),
    );
    if (docs.length) {
      const csv = await parseAsync(docs, {
        fields: [
          '_id',
          'courseId',
          'role',
          'isActive',
          'userId._id',
          'userId.isInternal',
          'userId.isActive',
          'userId.postulantId.firstName',
          'userId.postulantId.lastName',
          'userId.postulantId.email',
          'userId.postulantId.phone',
          'userId.postulantId.location',
          'userId.postulantId.birthDate',
          'userId.postulantId.dni',
        ],
      });
      if (csv) {
        res.set('Content-Type', 'text/csv');
        res.attachment('course-users-by-courseId.csv');
        return res.status(200).send(csv);
      }
    }
    throw new CustomError(400, 'This course does not have any members');
  }
  throw new CustomError(404, `Course with id ${req.params.id} was not found.`);
};

const exportToCsvByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const docs = await CourseUser.aggregate(
      geCourseBasedOnUserPipeline({ userId: new ObjectId(req.params.id) }),
    );
    if (docs.length) {
      const csv = await parseAsync(docs, {
        fields: [
          '_id',
          'role',
          'isActive',
          'courseId._id',
          'courseId.name',
          'courseId.inscriptionStartDate',
          'courseId.inscriptionEndDate',
          'courseId.startDate',
          'courseId.endDate',
          'courseId.type',
          'courseId.description',
          'courseId.isInternal',
          'courseId.isActive',
        ],
      });
      if (csv) {
        res.set('Content-Type', 'text/csv');
        res.attachment('course-users-by-userId.csv');
        return res.status(200).send(csv);
      }
    }
    throw new CustomError(400, 'This user does not belong to any course');
  }
  throw new CustomError(404, `User with id ${req.params.id} was not found.`);
};

export default {
  getByCourseId,
  getByUserId,
  assignRole,
  updateByUserId,
  disableByUserId,
  exportToCsvByCourseId,
  exportToCsvByUserId,
};
