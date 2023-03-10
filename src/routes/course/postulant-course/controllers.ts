import { Request, Response } from 'express';
import firebaseAdmin from 'firebase-admin';
import { parseAsync } from 'json2csv';
import { ObjectId } from 'mongodb';
import mongoose, { Types } from 'mongoose';

import logger from 'src/config/logger';
import sendgridTemplates from 'src/constants/sendgrid-templates';
import AdmissionResult from 'src/models/admission-result';
import Course, { PopulatedCourseType } from 'src/models/course';
import CourseUser, { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import PostulantCourse, { PopulatedPostulantCourseType } from 'src/models/postulant-course';
import Question from 'src/models/question';
import RegistrationForm from 'src/models/registration-form';
import User, { UserDocument } from 'src/models/user';
import { formatSort, paginateAndFilter } from 'src/utils/query';
import sendEmail from 'src/utils/send-email';
import userCreation from 'src/utils/user-creation';

import { getPostulantBasedOnCoursePipeline } from './aggregations';
import { FailedType, SuccessfulType } from './types';

const getCorrected = (docs: PopulatedPostulantCourseType[]) => {
  return docs.reduce(
    (prev = [{}], obj, index) => {
      let correctedTests = {};
      const { _id, course, postulant, view, ...rest } = obj;
      obj.admissionResults.forEach((ar) => {
        correctedTests = { ...correctedTests, [ar.admissionTest?.name]: ar.score };
      });
      prev[index] = { _id, course, postulant, view, ...correctedTests, ...rest };
      return prev;
    },
    [{}],
  );
};

const mapQuestionsWithValues = async (
  courseId: mongoose.Types.ObjectId,
  docs: PopulatedPostulantCourseType[],
) => {
  const registrationForm = await RegistrationForm.findOne({ course: courseId });
  const questions = await Question.find({ registrationForm: registrationForm?._id });

  const questionsToShow = questions.map((quest) => quest.title);

  return {
    docs: docs.reduce<unknown[]>((prevDoc, doc) => {
      const { answer, ...rest } = doc;
      const answersMapped = answer.reduce((prevAnswer, answer) => {
        const question = questions.find(
          (ques) => ques?._id.toString() === answer.question.toString(),
        );
        if (question) {
          return {
            ...prevAnswer,
            [question.title]: Array.isArray(answer.value)
              ? answer.value.sort().join(' | ')
              : answer.value,
          };
        }
        return prevAnswer;
      }, {});
      const view = registrationForm?.views.find(
        (view) => view._id?.toString() === rest.view.toString(),
      );
      const newDoc = {
        ...rest,
        ...answersMapped,
        view: view?.name,
      };
      return [...prevDoc, newDoc];
    }, []),
    questionsToShow,
  };
};

const getByCourseId = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  const corrected = req.query.corrected === 'true' ? true : false;
  delete req.query.corrected;
  const postulantCourse = await PostulantCourse.find({
    course: new ObjectId(courseId),
  });
  if (postulantCourse.length) {
    const { page, limit, query, sort } = paginateAndFilter(req.query);
    const postulantCourseAggregate = PostulantCourse.aggregate(
      getPostulantBasedOnCoursePipeline(
        { ...query, 'course._id': new ObjectId(courseId) },
        corrected,
        sort,
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
        message: `The list of postulants of the course with id: ${req.params.courseId} has been successfully found.`,
        data: docs,
        pagination,
        error: false,
      });
    }
    throw new CustomError(404, 'Could not find the list of postulants.');
  }
  throw new CustomError(404, 'This course does not have any postulants.');
};

const correctTests = async (req: Request, res: Response) => {
  let updatedPostulantCourse: PopulatedPostulantCourseType | null;
  const initialValues = [];
  const updatedPostulations = [];
  const corrections = req.body;
  try {
    for (let i = 0; i < corrections.length; i++) {
      const postulantCourse = await PostulantCourse.findOne({
        postulant: corrections[i].postulantId,
        course: req.params.courseId,
      });
      if (postulantCourse) {
        const notBelong = corrections[i].scores.some(
          (item: { admissionResult: Types.ObjectId }) =>
            !postulantCourse.admissionResults.includes(item.admissionResult),
        );
        if (notBelong) {
          throw new CustomError(
            400,
            `One of the admissionResult id does not belong to the postulation with id ${postulantCourse._id}.`,
          );
        }
        for (let j = 0; j < corrections[i].scores.length; j++) {
          const currentAR = await AdmissionResult.findById(
            corrections[i].scores[j].admissionResult,
          );
          initialValues.push(currentAR);
          await AdmissionResult.findByIdAndUpdate(
            {
              _id: currentAR?._id,
            },
            { score: corrections[i].scores[j].score },
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

      updatedPostulations[i] = updatedPostulantCourse;
    }
    return res.status(201).json({
      message: 'Tests successfully corrected.',
      data: updatedPostulations,
      error: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    for (let a = 0; a < initialValues.length; a++) {
      await AdmissionResult.findByIdAndUpdate(
        {
          _id: initialValues[a]?._id,
        },
        { score: initialValues[a]?.score },
        { new: true },
      );
    }
    throw err;
  }
};

const promoteOne = async (
  req: Request,
  failedPostulants: FailedType[],
  successfulPostulants: SuccessfulType[],
): Promise<string> => {
  let postulantId = undefined;
  try {
    let timeout = 0;
    for (let i = 0; i < req.body.length; i++) {
      let newMongoUser: UserDocument;
      let credentials: SuccessfulType['credentials'];
      postulantId = req.body[i].postulantId;
      const postulant = await Postulant.findById(postulantId);
      if (!postulant?._id) {
        throw new CustomError(404, `The postulant with id: ${postulantId} was not found.`);
      }
      const postulantCourse = await PostulantCourse.find({
        postulant: postulantId,
        course: req.params.courseId,
      });
      if (!postulantCourse.length) {
        throw new CustomError(
          404,
          `Postulant with id ${postulantId} was not found in this course and could not be promoted.`,
        );
      }
      req.body.email = postulant?.email;
      const user = await User.findOne({ postulant: postulantId });
      if (!user?._id) {
        timeout = timeout + 1;
        ({ newMongoUser, credentials } = await userCreation(req, postulantId, true, timeout));
      } else {
        newMongoUser = user;
      }

      logger.log({
        level: 'info',
        message: 'User founded.',
        label: 'postulant-course',
        userId: newMongoUser?._id,
      });

      const courseUser = await CourseUser.find({
        user: newMongoUser._id,
        course: req.params.courseId,
      });
      if (courseUser.length) {
        throw new CustomError(
          400,
          `The postulant with id: ${postulantId} has already a role in this course.`,
        );
      }
      await PostulantCourse.findOneAndUpdate(
        { postulant: postulantId, course: req.params.courseId },
        { isPromoted: true },
        {
          new: true,
        },
      );
      logger.log({
        level: 'info',
        message: 'Update postulation to isPromoted.',
        label: 'postulant-course',
        userId: newMongoUser?._id,
        postulantId,
      });
      try {
        if (newMongoUser._id) {
          const NewCourseUser = new CourseUser<CourseUserType>({
            user: newMongoUser._id,
            course: new Types.ObjectId(req.params.courseId),
            role: 'STUDENT',
            isActive: true,
          });
          await NewCourseUser.save();
          successfulPostulants.push({ postulantId, user: newMongoUser, credentials });
          logger.log({
            level: 'info',
            message: 'User added on the course.',
            label: 'postulant-course',
            userId: newMongoUser._id,
            courseId: NewCourseUser?.course,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        throw new CustomError(500, err.message, { ...err, type: 'COURSE_USER_MONGO_ERROR' });
      }
    }
    return 'Postulants promoted successfully.';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    failedPostulants.push({ postulantId: postulantId, error: err.message });
    throw err;
  }
};

const onError = async (users: SuccessfulType[], courseId: string) => {
  const usersUids: string[] = [];
  for (let u = 0; u < users.length; u++) {
    if (users[u]?.credentials?.firebaseUid) {
      usersUids.push(String(users[u]?.credentials?.firebaseUid));
      await User.findByIdAndDelete(users[u].user._id);
    }
    await CourseUser.findOneAndDelete({
      user: users[u].user._id,
      course: courseId,
    });
    await PostulantCourse.findOneAndUpdate(
      { postulant: users[u].postulantId },
      { isPromoted: false },
    );
  }
  await firebaseAdmin.auth().deleteUsers(usersUids);
};

const promoteMany = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  const currentDate = new Date();
  if (course && currentDate >= course.startDate) {
    throw new CustomError(400, 'The promotion of postulants must be before the course start date.');
  }
  const failedPostulants: FailedType[] = [];
  const successfulPostulants: SuccessfulType[] = [];
  let response: string;
  try {
    response = await promoteOne(req, failedPostulants, successfulPostulants);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await onError(successfulPostulants, courseId);
    throw err;
  }
  if (!failedPostulants.length) {
    for (let i = 0; i < successfulPostulants.length; i++) {
      let email;
      let template;
      let templateData;
      if (successfulPostulants[i]?.credentials) {
        email = successfulPostulants[i].credentials?.email;
        template = sendgridTemplates.sendUserCredentials;
        templateData = {
          email: successfulPostulants[i].credentials?.email,
          password: successfulPostulants[i]?.credentials?.newPassword,
        };
        successfulPostulants[i] = { ...successfulPostulants[i], credentials: undefined };
      } else {
        email = successfulPostulants[i].user.email;
        //TO-DO: Inscription Template
        template = sendgridTemplates.sendUserCredentials;
        templateData = { data: 'Inscription data' };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await sendEmail(email, template, templateData, async (err: any) => {
        if (err) {
          await onError(successfulPostulants, courseId);
          return new CustomError(500, err.message, { ...err, type: 'SENDGRID_ERROR' });
        }
      });
    }
  }
  return res.status(201).json({
    message: response,
    data: { failedPostulants, successfulPostulants },
    error: false,
  });
};

const physicalDeleteByCourseId = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.params.postulantId);
  if (postulant?._id) {
    const result = await PostulantCourse.findOneAndDelete({
      postulant: req.params.postulantId,
      course: req.params.courseId,
    });
    if (result) {
      for (let i = 0; i < result.admissionResults.length; i++) {
        const ar = result.admissionResults[i];
        await AdmissionResult.findByIdAndDelete({ _id: ar });
      }
      return res.status(200).json({
        message: 'The postulant-course been successfully deleted.',
        data: result,
        error: false,
      });
    }
    throw new CustomError(
      404,
      `Postulant with id ${req.params.postulantId} was not found in this course.`,
    );
  }
  throw new CustomError(404, `Postulant with id ${req.params.postulantId} was not found.`);
};

const exportToCsvByCourseId = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId).populate<PopulatedCourseType>({
    path: 'admissionTests',
  });
  if (course) {
    const corrected = req.query.corrected === 'true' ? true : false;
    delete req.query.corrected;

    const { sort, ...rest } = req.query;
    const { query } = paginateAndFilter(rest);
    const docs = await PostulantCourse.aggregate<PopulatedPostulantCourseType>(
      getPostulantBasedOnCoursePipeline(
        { ...query, 'course._id': new ObjectId(req.params.courseId) },
        corrected,
        formatSort(sort),
      ),
    );

    const { docs: docsMapped, questionsToShow } = await mapQuestionsWithValues(
      new mongoose.Types.ObjectId(req.params.courseId),
      docs,
    );

    if (docsMapped.length) {
      const tests = course.admissionTests.map((at) => at.name);
      const docsToExport = getCorrected(docsMapped as PopulatedPostulantCourseType[]);
      const csv = await parseAsync(docsToExport, {
        fields: [
          '_id',
          'course.name',
          'course.type',
          'course.isInternal',
          'view',
          'postulant.age',
          ...tests,
          ...questionsToShow,
        ],
      });
      if (csv) {
        res.set('Content-Type', 'text/csv');
        res.attachment('course-users-by-course.csv');
        return res.status(200).send(csv);
      }
    }
    throw new CustomError(404, 'This course does not have any members');
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

export default {
  getByCourseId,
  correctTests,
  promoteMany,
  physicalDeleteByCourseId,
  exportToCsvByCourseId,
};
