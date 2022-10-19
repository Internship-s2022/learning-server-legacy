import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';

import Course from 'src/models/course';
import CourseUser, { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import User from 'src/models/user';

const getByCourseId = async (req: Request, res: Response) => {
  const courseUser = await CourseUser.find({ courseId: req.params.id }).populate({
    path: 'userId',
  });
  if (courseUser) {
    return res.status(200).json({
      message: `The list of users and roles of the course with id: ${req.params.id} has been successfully found`,
      data: courseUser,
      error: false,
    });
  }
  throw new CustomError(
    404,
    `Users and roles of the course with id: ${req.params.id} was not found.`,
  );
};

const getByUserId = async (req: Request, res: Response) => {
  const courseUser = await CourseUser.find({ userId: req.params.id }).populate({
    path: 'courseId',
  });
  if (courseUser) {
    return res.status(200).json({
      message: `The list of courses and roles of the user with id: ${req.params.id} has been successfully found`,
      data: courseUser,
      error: false,
    });
  }
  throw new CustomError(
    404,
    `Courses and roles of the user with id: ${req.params.id} was not found.`,
  );
};

const create = async (req: Request, res: Response) => {
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
    throw new CustomError(400, 'The user or course does not exist');
  }
};

const updateByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  const course = await Course.findById(req.body.courseId);
  if (user && course) {
    const courseUser = await CourseUser.find({
      userId: req.params.id,
      courseId: req.body.courseId,
    });
    if (courseUser.length) {
      const updatedCourseUser = await CourseUser.findOneAndUpdate(
        courseUser[0]?._id,
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
    throw new CustomError(404, `User with id ${req.params.id} does not have a rol in this course.`);
  } else {
    if (!user?._id) {
      throw new CustomError(404, `User with id ${req.params.id} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.body.courseId} was not found.`);
  }
};

const deleteByUserId = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  const course = await Course.findById(req.body.courseId);
  if (user && course) {
    const courseUser = await CourseUser.find({
      userId: req.params.id,
      courseId: req.body.courseId,
    });
    if (courseUser[0]?.isActive === false) {
      throw new CustomError(404, 'The user has already been disabled');
    }
    if (courseUser.length) {
      const result = await CourseUser.findByIdAndUpdate(
        courseUser[0]._id,
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
    throw new CustomError(404, `User with id ${req.params.id} does not have a rol in this course.`);
  } else {
    if (!user?._id) {
      throw new CustomError(404, `User with id ${req.params.id} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.body.courseId} was not found.`);
  }
};

const exportToCsvByCourseId = async (req: Request, res: Response) => {
  const docs = await CourseUser.aggregate([
    { $match: { courseId: req.params.id } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $project: { userId: 0 } },
    { $unwind: { path: '$user' } },
  ]);
  if (docs.length) {
    const csv = await parseAsync(docs, {
      fields: ['_id', 'courseId', 'role', 'isActive', 'user._id', 'user.isInternal'],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('users.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'Cannot find the list of users.');
};

const exportToCsvByUserId = async (req: Request, res: Response) => {
  const docs = await CourseUser.aggregate([
    { $match: { userId: req.params.id } },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $project: { userId: 0 } },
    { $unwind: { path: '$course' } },
  ]);
  if (docs.length) {
    const csv = await parseAsync(docs, {
      fields: ['_id', 'userId', 'role', 'isActive', 'course._id', 'course.name'],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('users.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'Cannot find the list of courses.');
};

export default {
  getByCourseId,
  getByUserId,
  create,
  updateByUserId,
  deleteByUserId,
  exportToCsvByCourseId,
  exportToCsvByUserId,
};
