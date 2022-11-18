import mongoose from 'mongoose';

import { CourseType } from '../../src/models/course';
import { PostulantType } from '../../src/models/postulant';
import { PostulantCourseType } from '../../src/models/postulant-course';
import { padMessage } from '../utils';

const randomPostulantCourse = (
  courseId: mongoose.Types.ObjectId,
  postulantId: mongoose.Types.ObjectId,
  admissionResults: mongoose.Types.ObjectId[],
): PostulantCourseType => {
  return {
    course: courseId,
    postulant: postulantId,
    admissionResults,
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    answer: [],
  };
};

export const generaterandomPostulantCourses = (
  courses: CourseType[],
  postulants: PostulantType[],
) => {
  console.log('\x1b[36m', padMessage('⚡️ Adding postulants in Courses'));
  const postulantCourses: PostulantCourseType[] = [];

  for (let c = 0; c < 4; c++) {
    const course = courses[c];
    const admissionResults = courses[c].admissionTests;
    for (let p = 0; p < 5; p++) {
      const postulant = postulants[p];
      const postulantCourse = randomPostulantCourse(
        course._id as mongoose.Types.ObjectId,
        postulant._id as mongoose.Types.ObjectId,
        admissionResults,
      );
      postulantCourses.push(postulantCourse);
    }
  }
  console.log(postulantCourses);
  return { postulantCourses };
};
