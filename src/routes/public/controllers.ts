import { isAfter, isBefore } from 'date-fns';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import logger from 'src/config/logger';
import AdmissionResult from 'src/models/admission-result';
import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import Postulant, { PostulantType } from 'src/models/postulant';
import PostulantCourse, { AnswerType, PostulantCourseType } from 'src/models/postulant-course';
import Question from 'src/models/question';
import RegistrationForm from 'src/models/registration-form';
import User from 'src/models/user';
import { filterIncludeArrayOfIds, paginateAndFilter } from 'src/utils/query';

import validation from '../postulant/validations';
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
  const today = new Date();
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

      if (
        isAfter(today, course.inscriptionStartDate) &&
        isAfter(today, course.inscriptionEndDate)
      ) {
        const viewToSend = registrationForm.views.find(
          (view) => view._id?.toString() === req.query.view?.toString() ?? defaultView?.toString(),
        );
        let preInscriptionFormUrl = '';
        switch (viewToSend?.name) {
          case 'Conocidos':
            preInscriptionFormUrl = process.env.PRE_INSCRIPTION_FORM_KNOWNS_URL || '';
            break;
          case 'Facultad':
            preInscriptionFormUrl = process.env.PRE_INSCRIPTION_FORM_UNIVERSITY_URL || '';
            break;
          case 'Redes':
            preInscriptionFormUrl = process.env.PRE_INSCRIPTION_FORM_SOCIAL_MEDIA_URL || '';
            break;
          default:
            preInscriptionFormUrl = process.env.PRE_INSCRIPTION_FORM_HOMEPAGE_URL || '';
            break;
        }
        throw new CustomError(400, 'The inscription process of this course has end.', {
          type: 'INSCRIPTION_PROCESS_END',
          preInscriptionFormUrl,
        });
      }
      if (isBefore(today, course.inscriptionStartDate)) {
        throw new CustomError(400, 'The inscription process of this course has not started yet.', {
          type: 'COURSE_NOT_STARTED',
          inscriptionStartDate: course.isInternal ? undefined : course.inscriptionStartDate,
        });
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
            view: req.query.view,
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

export const validateEmail = async (
  email: string,
  errorMessage = 'An error has occurred. Please contact us.',
) => {
  const postulantWithEmail = await Postulant.findOne({ email: email });
  const userWithEmail = await User.findOne({ email: email });
  if (postulantWithEmail || userWithEmail)
    throw new CustomError(400, errorMessage, {
      type: 'ACCOUNT_ERROR',
      label: 'public-postulant-course',
    });
};

const createPostulation = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  const currentDate = new Date();
  if (course) {
    if (currentDate < course.inscriptionStartDate || currentDate > course.inscriptionEndDate) {
      throw new CustomError(400, 'The postulation must be created between the inscription dates.', {
        label: 'public-postulant-course',
      });
    }
    if (!course.admissionTests.length) {
      throw new CustomError(
        400,
        `The course with id: ${req.params.courseId} must have admission tests to create the postulation.`,
        { label: 'public-postulant-course' },
      );
    }

    const registrationForm = await RegistrationForm.findOne({
      course: course._id,
    });

    if (req.body.view === undefined) {
      req.body.view = registrationForm?.views.find((view) => view.name === 'Homepage')?._id;
    }

    if (!registrationForm?.views.some((view) => view._id == req.body.view))
      throw new CustomError(
        400,
        `The view with id: ${req.body.view} does not belong to the registration form of this course.`,
        { label: 'public-postulant-course' },
      );

    const generalQuestions = await Question.find({
      view: registrationForm?.views.find((view) => view.name === 'General')?._id,
      key: { $exists: true },
    });

    const answers: AnswerType[] = req.body.answer;

    const isValid = generalQuestions.every((question) =>
      answers.map((q) => String(q.question)).includes(String(question._id)),
    );

    if (!isValid) {
      throw new CustomError(
        400,
        'All the questions about the postulant personal information must be answered.',
        { label: 'public-postulant-course' },
      );
    }

    const enteredQuestions = await Question.find(
      filterIncludeArrayOfIds(answers.map((a: AnswerType) => a.question.toString())),
    );

    let postulantInfo: PostulantType | Record<string, unknown> = {};

    answers.forEach((a) => {
      const question = enteredQuestions.find((q) => a.question == q._id);
      if (!question?._id)
        throw new CustomError(404, `The question with id ${a.question} was not found.`, {
          label: 'public-postulant-course',
        });
      if (question.isRequired && !a.value)
        throw new CustomError(
          400,
          `The question with id ${question._id} is required and must be answered.`,
          { label: 'public-postulant-course' },
        );
      if (a.value) {
        switch (question?.type) {
          case 'SHORT_ANSWER':
            if (typeof a.value !== 'string')
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer value must be a string.`,
                { label: 'public-postulant-course' },
              );
            if (a.value.length > 200)
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer can't have more than 200 characters.`,
                { label: 'public-postulant-course' },
              );
            break;
          case 'PARAGRAPH':
            if (typeof a.value !== 'string')
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer value must be a string.`,
                { label: 'public-postulant-course' },
              );
            break;
          case 'MULTIPLE_CHOICES':
          case 'DROPDOWN':
            if (typeof a.value !== 'string')
              throw new CustomError(
                400,
                `For the question with id ${question._id}, answer value must be a string.`,
                { label: 'public-postulant-course' },
              );
            if (!question.options?.some((op) => a.value === op.value))
              throw new CustomError(
                400,
                `Answer value for the question with id ${
                  question._id
                } must be one of the options: ${question.options?.map((op) => op.value)}.`,
                { label: 'public-postulant-course' },
              );
            break;
          case 'CHECKBOXES':
            if (typeof a.value !== 'object')
              throw new CustomError(
                400,
                `For this question with id ${question._id}, answer value must be an array one or many strings.`,
                { label: 'public-postulant-course' },
              );
            if (!question.options?.some((op) => a.value?.includes(op.value)))
              throw new CustomError(
                400,
                `Answer value must be one of the options: ${question.options?.map(
                  (op) => op.value,
                )}.`,
                { label: 'public-postulant-course' },
              );
            break;
          default:
            break;
        }
        if (question?.key)
          postulantInfo = {
            ...postulantInfo,
            [question.key]: Array.isArray(a.value) ? a.value[0] : a.value,
          };
      }
    });

    validation.postulantValidation({ ...postulantInfo, isActive: true });

    let postulantId;
    const postulant = await Postulant.findOne({ dni: postulantInfo.dni, isActive: true });

    if (postulant) {
      const postulantCourse = await PostulantCourse.findOne({
        course: req.params.courseId,
        postulant: postulant._id,
      });
      if (postulantCourse) {
        throw new CustomError(
          400,
          `Postulant with dni ${postulant.dni} was already postulated on this course.`,
          { label: 'public-postulant-course' },
        );
      }
      postulantId = postulant._id;
      logger.log({
        level: 'info',
        message: 'Postulant existed.',
        label: 'public-postulant-course',
        postulantId,
      });
    } else {
      await validateEmail(String(postulantInfo.email));
      const newPostulant = new Postulant({ ...postulantInfo, isActive: true });
      await newPostulant.save();
      postulantId = newPostulant._id;
      logger.log({
        level: 'info',
        message: 'Postulant created.',
        label: 'public-postulant-course',
        postulantId,
      });
    }

    try {
      const setAdmissionResults = await AdmissionResult.insertMany(
        course.admissionTests.map((item) => ({
          admissionTest: item,
        })),
      );

      const newPostulantCourse = new PostulantCourse<PostulantCourseType>({
        course: new mongoose.Types.ObjectId(req.params.courseId),
        postulant: postulantId,
        admissionResults: setAdmissionResults.map((item) => item._id),
        answer: req.body.answer,
        view: req.body.view,
        isPromoted: false,
      });
      await newPostulantCourse.save();

      logger.log({
        level: 'info',
        message: 'Postulation created with the admission test results.',
        label: 'public-postulant-course',
        postulantId: newPostulantCourse?._id,
        admissionResults: setAdmissionResults,
      });

      return res.status(201).json({
        message: 'Postulant successfully registered.',
        data: newPostulantCourse,
        error: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await Postulant.findByIdAndDelete(postulantId);
      throw new CustomError(500, err.message, {
        ...err,
        type: 'POSTULANT_COURSE_MONGO_ERROR',
        label: 'public-postulant-course',
      });
    }
  } else {
    throw new CustomError(404, `Course with id ${req.params.course} was not found.`, {
      label: 'public-postulant-course',
    });
  }
};

export default { getCourses, getCourseById, getRegistrationFormByView, createPostulation };
