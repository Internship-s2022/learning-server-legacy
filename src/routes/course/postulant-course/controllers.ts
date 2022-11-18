import { Request, Response } from 'express';
import firebaseAdmin from 'firebase-admin';
import { parseAsync } from 'json2csv';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

import sendgridTemplates from 'src/constants/sendgrid-templates';
import AdmissionResult from 'src/models/admission-result';
import Course, { PopulatedCourseType } from 'src/models/course';
import CourseUser, { CourseUserType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import PostulantCourse, {
  AnswerType,
  PopulatedPostulantCourseType,
  PostulantCourseType,
} from 'src/models/postulant-course';
import Question from 'src/models/question';
import User, { UserDocument } from 'src/models/user';
import { filterIncludeArrayOfIds, paginateAndFilterByIncludes } from 'src/utils/query';
import sendEmail from 'src/utils/send-email';
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
      throw new CustomError(400, 'The postulation must be created between the inscription dates.');
    }
    if (postulantCourse.length) {
      throw new CustomError(
        400,
        `The postulant with id: ${req.body.postulant} has been already postulated in this course.`,
      );
    }

    try {
      const answers: AnswerType[] = req.body.answer;
      const enteredQuestions = await Question.find(
        filterIncludeArrayOfIds(answers.map((a: AnswerType) => a.question.toString())),
      );
      answers.forEach((a) => {
        const question = enteredQuestions.find((q) => a.question == q._id);
        if (question?.isRequired && !a.value)
          throw new CustomError(
            400,
            `The question with id ${question._id} is required and must be answered.`,
          );
        if (a.value) {
          switch (question?.type) {
            case 'SHORT_ANSWER':
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
    } catch (err: any) {
      throw new Error(err.message);
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
    });
    await newPostulantCourse.save();
    return res.status(201).json({
      message: 'Postulant successfully registered.',
      data: newPostulantCourse,
      error: false,
    });
  } else {
    throw new CustomError(404, 'The postulant or course does not exist.');
  }
};

const getPostulantBasedOnCoursePipeline = (
  query: qs.ParsedQs | { [k: string]: ObjectId },
  corrected?: boolean,
) => [
  {
    $lookup: {
      from: 'admissionresults',
      localField: 'admissionResults',
      foreignField: '_id',
      as: 'admissionResults',
    },
  },
  {
    $unwind: {
      path: '$admissionResults',
    },
  },

  {
    $lookup: {
      from: 'admissiontests',
      localField: 'admissionResults.admissionTest',
      foreignField: '_id',
      as: 'admissionResults.admissionTest',
    },
  },
  {
    $unwind: {
      path: '$admissionResults.admissionTest',
    },
  },
  {
    $group: {
      _id: '$_id',
      admissionResults: {
        $push: '$admissionResults',
      },
    },
  },
  {
    $lookup: {
      from: 'postulantcourses',
      localField: '_id',
      foreignField: '_id',
      as: 'newField',
    },
  },
  {
    $unwind: {
      path: '$newField',
    },
  },
  {
    $addFields: {
      'newField.admissionResults': '$admissionResults',
    },
  },
  {
    $replaceRoot: {
      newRoot: '$newField',
    },
  },
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

const getCorrected = (docs: PopulatedPostulantCourseType[]) => {
  return docs.reduce(
    (prev = [{}], obj, index) => {
      let correctedTests = {};
      const { _id, course, postulant, view } = obj;
      obj.admissionResults.forEach((ar) => {
        correctedTests = { ...correctedTests, [ar.admissionTest?.name]: ar.score };
      });
      prev[index] = { _id, course, postulant, view, ...correctedTests };
      return prev;
    },
    [{}],
  );
};

const getByCourseId = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;

  const corrected = req.query.corrected ? true : false;
  delete req.query.corrected;

  const course = await Course.findById(courseId);
  if (course) {
    const postulantCourse = await PostulantCourse.find({ course: new ObjectId(courseId) });
    if (postulantCourse.length) {
      const { page, limit, query } = paginateAndFilterByIncludes(req.query);
      const postulantCourseAggregate = PostulantCourse.aggregate(
        getPostulantBasedOnCoursePipeline(
          { ...query, 'course._id': new ObjectId(courseId) },
          corrected,
        ),
      );
      console.log('postulantCourse', postulantCourse.length);

      const { docs, ...pagination } = await PostulantCourse.aggregatePaginate(
        postulantCourseAggregate,
        {
          page,
          limit,
        },
      );
      console.log('docs', docs.length);

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
    throw new CustomError(400, 'This course does not have any postulants.');
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

const correctTests = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  const updatedPostulations = [];
  let updatedPostulantCourse: PopulatedPostulantCourseType | null;
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
              const notBelong = req.body[i].scores.some(
                (item: { admissionResult: Types.ObjectId }) =>
                  !postulantCourse.admissionResults.includes(item.admissionResult),
              );
              if (notBelong) {
                throw new CustomError(
                  400,
                  `One of the admissionResult id does not belong to the postulation with id ${postulantCourse._id}.`,
                );
              }
              await AdmissionResult.findOneAndUpdate(
                {
                  _id: req.body[i].scores[j].admissionResult,
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

const promoteOne = async (
  req: Request,
  remainPostulants: { postulantId: string }[],
  step: number,
  failedPostulants: { postulantId: string | undefined; error: any }[],
  successfulPostulants: {
    postulantId: string | undefined;
    user: UserDocument;
    credentials: { email: string; newPassword: string; firebaseUid: string } | undefined;
  }[],
): Promise<string> => {
  const index = 0;
  let postulantId;
  try {
    let timeout = 0;
    for (let i = 0; i < remainPostulants.length; i++) {
      let newMongoUser;
      let credentials;
      let response;
      const promotion = true;
      postulantId = remainPostulants[i].postulantId;
      const postulant = await Postulant.findById(postulantId);
      // index = i;
      const postulantCourse = await PostulantCourse.find({
        postulant: postulantId,
        course: req.params.courseId,
      });
      if (!postulant?._id) {
        throw new CustomError(404, `The postulant with id: ${postulantId} was not found.`);
      }
      if (!postulantCourse) {
        throw new CustomError(
          404,
          `Postulant with id ${postulantId} was not found in this course and could not be promoted.`,
        );
      }
      req.body.email = postulant?.email;
      const user = await User.findOne({ postulant: postulantId });
      if (!user?._id) {
        timeout = timeout + 1;
        response = await userCreation(req, postulantId, promotion, timeout);
        newMongoUser = response.newMongoUser;
        credentials = response.credentials;
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
          successfulPostulants.push({ postulantId, user: newMongoUser, credentials });
        }
      } catch (err: any) {
        throw new Error(`Course-user error: ${err.message}`);
      }
    }
    return 'There was no errors';
  } catch (err: any) {
    // remainPostulants = remainPostulants?.slice(index + 1);
    failedPostulants.push({ postulantId, error: err.message });
    // if (remainPostulants?.length) {
    //   step++;
    //   return await promoteOne(req, remainPostulants, step, failedPostulants, successfulPostulants);
    // } else {
    //   if (failedPostulants.length === req.body.length) {
    throw new Error(`Error: ${err.message}`);
    //   }
    //   return `The postulants with id: ${successfulPostulants.map((p) => p)} were promoted.
    // 		The postulants with id: ${failedPostulants.map((p) => p)} failed to be promoted.`;
    // }
  }
};

const onError = async (
  users: {
    postulantId: string | undefined;
    user: UserDocument;
    credentials: { email: string; newPassword: string; firebaseUid: string };
  }[],
  courseId: string,
) => {
  const usersUids: string[] = [];
  users.forEach(async (obj) => {
    const deleted = await CourseUser.findOneAndDelete({
      user: obj.user._id,
      course: courseId,
    });
    console.log('deleted', deleted);
    if (obj?.credentials?.firebaseUid) {
      usersUids.push(obj.credentials.firebaseUid);
      await User.findByIdAndDelete(obj.user._id);
    }
  });
  const usersRemoved = await firebaseAdmin.auth().deleteUsers(usersUids);
  console.log('uids:', usersUids, usersRemoved);
};

const promoteMany = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  if (course?._id) {
    const currentDate = new Date();
    // if (currentDate >= course.startDate) {
    //   throw new CustomError(
    //     400,
    //     'The promotion of postulants must be before the course start date.',
    //   );
    // }
    const step = 0;
    const remainPostulants = req.body;
    const failedPostulants: { postulantId: string | undefined; error: any }[] = [];
    const successfulPostulants: {
      postulantId: string | undefined;
      user: UserDocument;
      credentials: { email: string; newPassword: string; firebaseUid: string };
    }[] = [];
    let response: string;
    try {
      response = await promoteOne(
        req,
        remainPostulants,
        step,
        failedPostulants,
        successfulPostulants,
      );
    } catch (err: any) {
      console.log('failed', failedPostulants, '\n success', successfulPostulants);
      await onError(successfulPostulants, req.params.courseId);
      throw new Error('There was an error.');
    }
    if (!failedPostulants.length) {
      console.log('enviando mails');
      successfulPostulants.forEach(async (obj) => {
        const email = obj?.credentials ? obj.credentials.email : obj.user.email;
        const template = obj?.credentials
          ? sendgridTemplates.sendUserCredentials
          : //TO-DO: Inscription Template
            sendgridTemplates.sendUserCredentials;
        await sendEmail(
          email,
          template,
          {
            email: obj.credentials.email,
            password: obj.credentials.newPassword,
          },
          async (err: any) => {
            if (err) {
              await onError(successfulPostulants, req.params.courseId);
              // await User.findByIdAndDelete(obj.newMongoUser._id);
              // await firebase.auth().deleteUser(firebaseUid);
              return new Error(`Sendgrid error: ${err.message}`);
            }
          },
        );
      });
    }
    return res.status(201).json({
      message: response,
      data: { failedPostulants, successfulPostulants },
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
      result.admissionResults.forEach(async (ar) => {
        await AdmissionResult.findByIdAndDelete({ _id: ar });
      });
      return res.status(200).json({
        message: 'The postulant-course been successfully deleted.',
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

const exportToCsvByCourseId = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.courseId).populate<PopulatedCourseType>({
    path: 'admissionTests',
  });
  if (course) {
    const corrected = req.query.corrected ? true : false;
    delete req.query.corrected;

    const { query } = paginateAndFilterByIncludes(req.query);
    const docs = await PostulantCourse.aggregate(
      getPostulantBasedOnCoursePipeline(
        { ...query, 'course._id': new ObjectId(req.params.courseId) },
        corrected,
      ),
    );
    const tests = course.admissionTests.map((at) => at.name);
    const docsToExport = getCorrected(docs);
    if (docsToExport.length) {
      const csv = await parseAsync(docsToExport, {
        fields: [
          '_id',
          'course.name',
          'course.inscriptionStartDate',
          'course.inscriptionEndDate',
          'course.startDate',
          'course.endDate',
          'course.type',
          'course.description',
          'course.isInternal',
          'postulant.firstName',
          'postulant.lastName',
          'postulant.email',
          'postulant.phone',
          'postulant.location',
          'postulant.birthDate',
          'postulant.dni',
          'view',
          ...tests,
        ],
      });
      if (csv) {
        res.set('Content-Type', 'text/csv');
        res.attachment('course-users-by-course.csv');
        return res.status(200).send(csv);
      }
    }
    throw new CustomError(400, 'This course does not have any members');
  }
  throw new CustomError(404, `Course with id ${req.params.courseId} was not found.`);
};

export default {
  create,
  getByCourseId,
  correctTests,
  promoteMany,
  physicalDeleteByCourseId,
  exportToCsvByCourseId,
};
