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
    _id: new mongoose.Types.ObjectId(),
    course: courseId,
    user: userId,
    role: isInternal
      ? faker.helpers.arrayElement(['ADMIN', 'TUTOR', 'AUXILIARY', 'STUDENT'])
      : 'STUDENT',
    isActive: true,
  };
};

export const generateRandomCourseUsers = (
  courses: CourseType[],
  users: UserType[],
  defaultCourseUsers: CourseUserType[],
) => {
  console.log('\x1b[36m', padMessage('⚡️ Adding Users in Courses'));
  const courseUsers: CourseUserType[] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    if (course._id?.toString() !== '1e063109a88495b45758c006') {
      for (let u = 0; u < users.length; u++) {
        const user = users[u];
        let courseUser: CourseUserType;
        if (
          !defaultCourseUsers.some(
            (cUser) =>
              cUser.user.toString() === user._id?.toString() &&
              cUser.course.toString() === course._id?.toString(),
          )
        ) {
          if (course.isInternal && user.isInternal) {
            courseUser = randomCourseUser(
              true,
              new mongoose.Types.ObjectId(course._id),
              new mongoose.Types.ObjectId(user._id),
            );
            courseUsers.push(courseUser);
          } else if (!course.isInternal) {
            courseUser = randomCourseUser(
              user.isInternal,
              new mongoose.Types.ObjectId(course._id),
              new mongoose.Types.ObjectId(user._id),
            );
            courseUsers.push(courseUser);
          }
        }
      }
    }
  }

  return { courseUsers };
};
