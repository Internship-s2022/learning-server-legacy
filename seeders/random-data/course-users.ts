import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { CourseType } from '../../src/models/course';
import { CourseUserType } from '../../src/models/course-user';
import { UserType } from '../../src/models/user';
import { padMessage } from '../utils';

const randomCourseUser = (
  isInternal: boolean,
  courseId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
): CourseUserType => {
  return {
    course: courseId,
    user: userId,
    role: isInternal
      ? faker.helpers.arrayElement(['ADMIN', 'TUTOR', 'AUXILIARY', 'STUDENT'])
      : 'STUDENT',
    isActive: true,
  };
};

export const generateRandomCourseUsers = (courses: CourseType[], users: UserType[]) => {
  console.log('\x1b[36m', padMessage('⚡️ Adding Users in Courses'));
  const courseUsers: CourseUserType[] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    for (let u = 0; u < users.length; u++) {
      const user = users[u];
      let courseUser: CourseUserType;
      if (course.isInternal && user.isInternal) {
        courseUser = randomCourseUser(
          true,
          course._id as mongoose.Types.ObjectId,
          user._id as mongoose.Types.ObjectId,
        );
        courseUsers.push(courseUser);
      } else if (!course.isInternal) {
        courseUser = randomCourseUser(
          user.isInternal,
          course._id as mongoose.Types.ObjectId,
          user._id as mongoose.Types.ObjectId,
        );
        courseUsers.push(courseUser);
      }
    }
  }

  return { courseUsers };
};
