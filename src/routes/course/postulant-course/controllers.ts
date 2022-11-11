import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

import AdmissionResult from 'src/models/admission-result';
import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import PostulantCourse, { PostulantCourseType } from 'src/models/postulant-course';
import { paginateAndFilterByIncludes } from 'src/utils/query';

const create = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulant);
  const course = await Course.findById(req.params.courseId);
  if (postulant && course) {
    const postulantCourse = await PostulantCourse.find({
      postulant: req.body.postulant,
      course: req.params.courseId,
    });
    if (postulantCourse.length) {
      throw new CustomError(
        400,
        `The postulant with id: ${req.body.postulant} has been already postulated in this course.`,
      );
    }
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

const getCorrectedByCourseId = async (req: Request, res: Response) => {
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
      throw new CustomError(404, 'Could not found the list of postulants.');
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

export default {
  create,
  getCorrectedByCourseId,
  correctTests,
};
