import { Request, Response } from 'express';
import mongoose from 'mongoose';

import AdmissionResult from 'src/models/admission-result';
import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import PostulantCourse, { AnswerType, PostulantCourseType } from 'src/models/postulant-course';
import Question from 'src/models/question';
import RegistrationForm from 'src/models/registration-form';
import { filterIncludeArrayOfIds, paginateAndFilter } from 'src/utils/query';

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
      const defaultView = registrationForm.views.find((view) => view.name === 'Homepage')?._id;
      const generalView = registrationForm.views.find((view) => view.name === 'General')?._id;

      if (req.query.view) {
        if (!mongoose.Types.ObjectId.isValid(String(req.query.view)))
          throw new CustomError(400, `Mongo id: ${req.query.view}  is not valid.`);
        viewBelongs = registrationForm.views.some((view) => view._id == req.query.view);
      }
      if (viewBelongs) {
        const questions = await Question.find({
          registrationForm: registrationForm._id,
          view: generalView,
        });

        let viewQuestions;

        if (
          req.query.view &&
          req.query.view != String(defaultView) &&
          req.query.view != String(generalView)
        ) {
          viewQuestions = await Question.find({
            registrationForm: registrationForm._id,
            view: req.query.query,
          });
        } else {
          viewQuestions = await Question.find({
            registrationForm: registrationForm._id,
            view: defaultView,
          });
        }

        questions.push(...viewQuestions);

        return res.status(200).json({
          message: 'The registration form with questions has been successfully found.',
          data: {
            title: registrationForm.title,
            description: registrationForm.description,
            questions,
          },
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

const createPostulation = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulant);
  const course = await Course.findById(req.params.courseId);
  const currentDate = new Date();
  if (postulant && course) {
    const postulantCourse = await PostulantCourse.find({
      postulant: req.body.postulant,
      course: req.params.courseId,
    });
    if (currentDate < course.inscriptionStartDate || currentDate > course.inscriptionEndDate) {
      throw new CustomError(400, 'The postulation must be created between the inscription dates.');
    }
    if (postulantCourse.length) {
      throw new CustomError(
        400,
        `The postulant with id: ${req.body.postulant} has been already postulated in this course.`,
      );
    }
    if (!course.admissionTests.length) {
      throw new CustomError(
        400,
        `The course with id: ${req.params.courseId} must have admission tests to create the postulation.`,
      );
    }
    const answers: AnswerType[] = req.body.answer;
    const enteredQuestions = await Question.find(
      filterIncludeArrayOfIds(answers.map((a: AnswerType) => a.question.toString())),
    );
    answers.forEach((a) => {
      const question = enteredQuestions.find((q) => a.question == q._id);
      if (!question?._id)
        throw new CustomError(404, `The question with id ${a.question} was not found.`);
      if (question.isRequired && !a.value)
        throw new CustomError(
          400,
          `The question with id ${question._id} is required and must be answered.`,
        );
      if (a.value) {
        switch (question?.type) {
          case 'SHORT_ANSWER':
            if (typeof a.value !== 'string')
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer value must be a string.`,
              );
            if (a.value.length > 50)
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer can't have more than 50 characters.`,
              );
            break;
          case 'PARAGRAPH':
            if (typeof a.value !== 'string')
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer value must be a string.`,
              );
            break;
          case 'MULTIPLE_CHOICES':
          case 'DROPDOWN':
            if (typeof a.value !== 'object' || a.value.length > 1)
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer value must be an array of one string.`,
              );
            if (!question.options?.some((op) => a.value?.includes(op.value)))
              throw new CustomError(
                400,
                `Answer value must be one of the options: ${question.options?.map(
                  (op) => op.value,
                )}.`,
              );
            break;
          case 'CHECKBOXES':
            if (typeof a.value !== 'object')
              throw new CustomError(
                400,
                `For this question with id ${question._id}, answer value must be an array one or many strings.`,
              );
            if (!question.options?.some((op) => a.value?.includes(op.value)))
              throw new CustomError(
                400,
                `Answer value must be one of the options: ${question.options?.map(
                  (op) => op.value,
                )}.`,
              );
            break;
          default:
            break;
        }
      }
    });
    const setAdmissionResults = await AdmissionResult.insertMany(
      course.admissionTests.map((item) => ({
        admissionTest: item,
      })),
    );
    const newPostulantCourse = new PostulantCourse<PostulantCourseType>({
      course: new mongoose.Types.ObjectId(req.params.courseId),
      postulant: req.body.postulant,
      admissionResults: setAdmissionResults.map((item) => item._id),
      answer: req.body.answer,
      view: req.body.view,
      isPromoted: false,
    });
    await newPostulantCourse.save();

    return res.status(201).json({
      message: 'Postulant successfully registered.',
      data: newPostulantCourse,
      error: false,
    });
  } else {
    throw new CustomError(404, `Postulant with id ${req.body.postulant} was not found.`);
  }
};

export default { getCourses, getCourseById, getRegistrationFormByView, createPostulation };
