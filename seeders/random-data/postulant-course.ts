import mongoose from 'mongoose';

import { AdmissionResultType } from 'src/models/admission-result';

import { CourseType } from '../../src/models/course';
import { PostulantType } from '../../src/models/postulant';
import { PostulantCourseType } from '../../src/models/postulant-course';
import { RegistrationFormType } from '../../src/models/registration-form';
import { padMessage } from '../utils';

const randomPostulantCourse = (
  courseId: mongoose.Types.ObjectId,
  postulantId: mongoose.Types.ObjectId,
  admissionResults: mongoose.Types.ObjectId[],
  view: mongoose.Types.ObjectId,
): PostulantCourseType => {
  return {
    course: courseId,
    postulant: postulantId,
    admissionResults,
    view: view,
    answer: [],
    isPromoted: false,
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
      score: Math.floor(Math.random() * 10),
    };
    newAdmissionResults.push(admissionResult);
    admissionResultsIds.push(admissionResult._id as mongoose.Types.ObjectId);
  }
  return { newAdmissionResults, admissionResultsIds };
};

export const generateRandomPostulantCourses = (
  courses: CourseType[],
  postulants: PostulantType[],
  registrationForms: RegistrationFormType[],
  amount: number,
) => {
  console.log('\x1b[36m', padMessage('⚡️ Adding postulants in Courses'));
  const postulantCourses: PostulantCourseType[] = [];
  let admissionResults: AdmissionResultType[] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    const randomView = registrationForms.find(
      (registrationForm) => registrationForm.course === course._id && registrationForm.isActive,
    )?.views[0]._id;
    for (let p = amount; p < amount + 10; p++) {
      const postulant = postulants[p];
      const { newAdmissionResults, admissionResultsIds } = generateRandomAdmissionResults(course);
      const postulantCourse = randomPostulantCourse(
        course._id as mongoose.Types.ObjectId,
        postulant._id as mongoose.Types.ObjectId,
        admissionResultsIds,
        randomView as mongoose.Types.ObjectId,
      );
      postulantCourses.push(postulantCourse);
      admissionResults = [...admissionResults, ...newAdmissionResults];
    }
  }
  return { postulantCourses, admissionResults };
};
