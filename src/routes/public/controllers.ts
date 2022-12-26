import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import Question from 'src/models/question';
import RegistrationForm from 'src/models/registration-form';
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

const getRegistrationFormByView = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const registrationForm = await RegistrationForm.findOne({
      course: course._id,
    });
    if (registrationForm) {
      let viewBelongs = true;
      const generalView = registrationForm.views.find((view) => view.name === 'General')?._id;

      if (req.query.view) {
        viewBelongs = registrationForm.views.some((view) => view._id == req.query.view);
      }
      if (viewBelongs) {
        const questions = await Question.find({
          registrationForm: registrationForm._id,
          view: generalView,
        });

        if (req.query.view && req.query.view != generalView?.toString()) {
          const viewQuestions = await Question.find({
            registrationForm: registrationForm._id,
            view: req.query.view,
          });
          questions.push(...viewQuestions);
        }

        return res.status(200).json({
          message: 'The registration form with questions has been successfully found.',
          data: { registrationForm, questions },
          error: false,
        });
      }
      throw new CustomError(
        400,
        `The view with id ${req.query.view} does not belong to the registration form of this course.`,
      );
    }
    throw new CustomError(
      404,
      `The registration form for the course with id ${req.params.courseId} was not found.`,
    );
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

export default { getCourses, getCourseById, getRegistrationFormByView };
