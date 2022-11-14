import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

import AdmissionResult from 'src/models/admission-result';
import Course from 'src/models/course';
import CourseUser, { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import PostulantCourse, { PostulantCourseType } from 'src/models/postulant-course';
import User from 'src/models/user';
import { paginateAndFilterByIncludes } from 'src/utils/query';
import userCreation from 'src/utils/user-creation';

const create = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulant);
  const course = await Course.findById(req.params.courseId);
  const currentDate = new Date();

  if (postulant && course) {
    const postulantCourse = await PostulantCourse.find({
      postulant: req.body.postulant,
      course: req.params.courseId,
    });
    if (currentDate < course.inscriptionStartDate || currentDate > course.inscriptionEndDate) {
      throw new CustomError(400, 'The postulation must be created between the inscription dates');
    }
    if (postulantCourse.length) {
      throw new CustomError(
        400,
        `The postulant with id: ${req.body.postulant} has been already postulated in this course.`,
      );
    }

    // TO-DO: must have all the requested answers

    // const isRequired = req.body.answer.some(async (a: AnswerType) => {
    //   const questionId = a.question;
    //   const question = await Question.findById(questionId);
    //   return question.isRequired && !a.value; //toma null por defecto
    // });
    // if (!isRequired) {
    //   throw new CustomError(400, 'All the required questions must be answered.');
    // }
    const setAdmissionResults = await AdmissionResult.insertMany(
      course.admissionTests.map((item) => ({
        admissionTest: item,
      })),
    );
    const newPostulantCourse = new PostulantCourse<PostulantCourseType>({
      course: new Types.ObjectId(req.params.courseId),
      postulant: req.body.postulant,
      admissionResults: setAdmissionResults.map((item) => item._id),
      answer: req.body.answer,
      view: req.body.view,
      isActive: req.body.isActive,
    });
    await newPostulantCourse.save();
    return res.status(201).json({
      message: 'Postulant successfully registered.',
      data: newPostulantCourse,
      error: false,
    });
  } else {
    throw new CustomError(404, 'The postulant or course does not exist');
  }
};

const getPostulantBasedOnCoursePipeline = (
  query: qs.ParsedQs | { [k: string]: ObjectId },
  corrected?: boolean,
) => [
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
    $lookup: {
      from: 'courses',
      localField: 'course',
      foreignField: '_id',
      as: 'course',
    },
  },
  { $unwind: { path: '$course' } },
  {
    $lookup: {
      from: 'admissionresults',
      localField: 'admissionResults',
      foreignField: '_id',
      as: 'admissionResults',
    },
  },
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
          admissionResults: { $not: { $elemMatch: { score: 0 } } },
        },
      }
    : { $match: query },
];

const getByCourseId = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;

  const corrected = req.query.corrected ? true : false;
  delete req.query.corrected;

  const course = await Course.findById(courseId);
  if (course) {
    const postulantCourse = await PostulantCourse.find({ course: courseId });
    if (postulantCourse.length) {
      const { page, limit, query } = paginateAndFilterByIncludes(req.query);
      const postulantCourseAggregate = PostulantCourse.aggregate(
        getPostulantBasedOnCoursePipeline(
          { ...query, 'course._id': new ObjectId(courseId) },
          corrected,
        ),
      );
      const { docs, ...pagination } = await PostulantCourse.aggregatePaginate(
        postulantCourseAggregate,
        {
          page,
          limit,
        },
      );
      if (docs.length) {
        return res.status(200).json({
          message: `The list of postulants of the course with id: ${req.params.courseId} has been successfully found`,
          data: docs,
          pagination,
          error: false,
        });
      }
      throw new CustomError(404, 'Could not find the list of postulants.');
    }
    throw new CustomError(400, 'This course does not have any postulants.');
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

const correctTests = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  const updatedPostulations = [];
  let updatedPostulantCourse: unknown = [];
  if (course?._id) {
    try {
      for (let i = 0; i < req.body.length; i++) {
        try {
          const postulantCourse = await PostulantCourse.findOne({
            postulant: req.body[i].postulantId,
            course: req.params.courseId,
          });
          if (postulantCourse) {
            for (let j = 0; j < req.body[i].scores.length; j++) {
              await AdmissionResult.findOneAndUpdate(
                {
                  _id: req.body[i].scores[j].admissionTestResult,
                },
                { score: req.body[i].scores[j].score },
                { new: true },
              );
            }
          } else {
            throw new CustomError(
              404,
              `Postulant with id ${req.body[i].postulantId} was not found in this course and could not be updated.`,
            );
          }
          updatedPostulantCourse = await PostulantCourse.findById(postulantCourse._id).populate({
            path: 'admissionResults',
          });
        } catch (err: any) {
          throw new Error(err.message);
        }
        updatedPostulations[i] = updatedPostulantCourse;
      }
      return res.status(201).json({
        message: 'Tests successfully corrected.',
        data: updatedPostulations,
        error: false,
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

const promoteMany = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  if (course?._id) {
    const currentDate = new Date();
    if (currentDate >= course.startDate) {
      throw new CustomError(
        400,
        'The promotion of postulants must be before the course start date.',
      );
    }
    try {
      let timeout = 0;
      for (let i = 0; i < req.body.length; i++) {
        let newMongoUser;
        const promotion = true;
        const postulantId = req.body[i].postulantId;
        const postulant = await Postulant.findById(postulantId);
        const user = await User.findOne({ postulant: postulantId });
        const postulantCourse = await PostulantCourse.find({
          postulant: postulantId,
          course: req.params.courseId,
        });
        if (!postulant?._id) {
          throw new CustomError(404, `The postulant with id: ${postulantId} was not found`);
        }
        if (!postulantCourse) {
          throw new CustomError(
            404,
            `Postulant with id ${postulantId} was not found in this course and could not be promoted.`,
          );
        }
        req.body.email = postulant?.email;
        if (!user?._id) {
          timeout = timeout + 1;
          newMongoUser = await userCreation(req, postulantId, promotion, timeout);
        } else {
          newMongoUser = user;
        }
        try {
          const courseUser = await CourseUser.find({
            user: newMongoUser._id,
            course: req.params.courseId,
          });
          if (courseUser.length) {
            throw new CustomError(
              400,
              `The user with id: ${newMongoUser._id} has already a role in this course.`,
            );
          }
          if (newMongoUser._id) {
            const NewCourseUser = new CourseUser<CourseUserType>({
              user: newMongoUser._id,
              course: new Types.ObjectId(req.params.courseId),
              role: 'STUDENT',
              isActive: true,
            });
            await NewCourseUser.save();
          }
        } catch (err: any) {
          throw new Error(`Course-user error: ${err.message}`);
        }
      }
    } catch (err: any) {
      throw new Error(err.message);
    }

    return res.status(201).json({
      message: 'Users successfully created',
      error: false,
    });
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

const physicalDeleteByCourseId = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulant);
  const course = await Course.findById(req.params.courseId);
  if (postulant && course) {
    const result = await PostulantCourse.findOneAndDelete({
      postulant: req.body.postulant,
      course: req.params.courseId,
    });
    if (result) {
      return res.status(200).json({
        message: 'The postulant-course been successfully deleted',
        data: result,
        error: false,
      });
    }
    throw new CustomError(
      404,
      `Postulant with id ${req.body.postulant} was not found in this course.`,
    );
  } else {
    if (!postulant?._id) {
      throw new CustomError(404, `Postulant with id ${req.body.postulant} was not found.`);
    }
    throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
  }
};

export default {
  create,
  getByCourseId,
  correctTests,
  promoteMany,
  physicalDeleteByCourseId,
};
