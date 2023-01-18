import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { CourseUserType } from 'src/models/course-user';
import { QuestionType } from 'src/models/question';
import { UserType } from 'src/models/user';

import { AdmissionResultType } from '../../src/models/admission-result';
import { CourseType } from '../../src/models/course';
import { PostulantType } from '../../src/models/postulant';
import { AnswerType, PostulantCourseType } from '../../src/models/postulant-course';
import { RegistrationFormType } from '../../src/models/registration-form';
import { padMessage } from '../utils';

const today = new Date();

const randomAnswer = (question: QuestionType, postulant: PostulantType): AnswerType => {
  let value: string | string[] = 'string';

  if (question.type === 'CHECKBOXES') {
    value = faker.helpers.arrayElements(question.options?.map((option) => option.value));
  } else if (question.type === 'DROPDOWN' || question.type === 'MULTIPLE_CHOICES') {
    value = faker.helpers.arrayElement(question.options?.map((option) => option.value));
  } else {
    value = faker.word.noun();
  }

  if (question.key === 'firstName') {
    value = postulant.firstName;
  }
  if (question.key === 'lastName') {
    value = postulant.lastName;
  }
  if (question.key === 'birthDate') {
    value = postulant.birthDate;
  }
  if (question.key === 'country') {
    value = postulant.country;
  }
  if (question.key === 'dni') {
    value = postulant.dni;
  }
  if (question.key === 'email') {
    value = postulant.email;
  }
  if (question.key === 'phone') {
    value = postulant.phone;
  }

  return {
    _id: new mongoose.Types.ObjectId(),
    question: new mongoose.Types.ObjectId(question._id),
    value,
  };
};

const randomPostulantCourse = (
  courseId: mongoose.Types.ObjectId,
  postulant: PostulantType,
  admissionResults: mongoose.Types.ObjectId[],
  views: mongoose.Types.ObjectId[],
  questions: QuestionType[],
  isPromoted: boolean,
): PostulantCourseType => {
  const [generalView, randomView] = views;

  const questionsToAnswer = questions.filter(
    (question) =>
      question.view.toString() === generalView.toString() ||
      question.view.toString() === randomView.toString(),
  );

  const answer = questionsToAnswer.map((question) => randomAnswer(question, postulant));

  return {
    _id: new mongoose.Types.ObjectId(),
    course: courseId,
    postulant: new mongoose.Types.ObjectId(postulant._id),
    admissionResults,
    view: randomView,
    answer,
    isPromoted,
  };
};

export const generateRandomAdmissionResults = (course: CourseType) => {
  const newAdmissionResults: AdmissionResultType[] = [];
  const admissionResultsIds: mongoose.Types.ObjectId[] = [];
  for (let at = 0; at < course.admissionTests.length; at++) {
    const admissionTest = course.admissionTests[at]._id;
    const admissionResult: AdmissionResultType = {
      _id: new mongoose.Types.ObjectId(),
      admissionTest: admissionTest,
      score: faker.datatype.number({ min: 0, max: 10 }),
    };
    newAdmissionResults.push(admissionResult);
    admissionResultsIds.push(new mongoose.Types.ObjectId(admissionResult._id));
  }
  return { newAdmissionResults, admissionResultsIds };
};

export const generateRandomPostulantCourses = (
  courses: CourseType[],
  postulants: PostulantType[],
  registrationForms: RegistrationFormType[],
  allUsers: UserType[],
  questions: QuestionType[],
  courseUsers: CourseUserType[],
) => {
  console.log('\x1b[36m', padMessage('⚡️ Adding postulants in Courses'));
  const postulantCourses: PostulantCourseType[] = [];
  let admissionResults: AdmissionResultType[] = [];
  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    if (today >= course.inscriptionStartDate) {
      const regForm = registrationForms.find(
        (registrationForm) => registrationForm.course === course._id,
      );
      for (let p = 0; p < postulants.length; p++) {
        const generalView = regForm?.views[0]._id;
        const randomView =
          regForm?.views[faker.datatype.number({ min: 1, max: regForm.views.length - 1 })]._id;
        const postulant = postulants[p];
        if (!course.isInternal) {
          const user = allUsers.find(
            (user) => user.postulant.toString() === postulant?._id?.toString(),
          );
          const { newAdmissionResults, admissionResultsIds } =
            generateRandomAdmissionResults(course);
          const postulantCourse = randomPostulantCourse(
            new mongoose.Types.ObjectId(course._id),
            postulant,
            admissionResultsIds,
            [new mongoose.Types.ObjectId(generalView), new mongoose.Types.ObjectId(randomView)],
            questions,
            courseUsers.some((cUser) => cUser.user.toString() === user?._id?.toString()),
          );
          postulantCourses.push(postulantCourse);
          admissionResults = [...admissionResults, ...newAdmissionResults];
        }
      }
    }
  }
  return { postulantCourses, admissionResults };
};
