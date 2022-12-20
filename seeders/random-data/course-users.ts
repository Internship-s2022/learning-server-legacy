import mongoose from 'mongoose';

import { CourseType } from '../../src/models/course';
import { CourseUserType, RoleType } from '../../src/models/course-user';
import { UserType } from '../../src/models/user';
import { padMessage } from '../utils';

const adminsPerCourse = 5;
const tutorsPerCourse = parseInt(process.env.RANDOM_TUTORS_PER_COURSE || '15');

const randomCourseUser = (
  courseId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  role?: RoleType,
): CourseUserType => {
  return {
    _id: new mongoose.Types.ObjectId(),
    course: courseId,
    user: userId,
    role: role ? role : 'STUDENT',
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
    let countAdmins = 1;
    let countTutors = 1;
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
          if ((course.isInternal && user.isInternal) || !course.isInternal) {
            let role: RoleType | undefined = undefined;
            if (countAdmins < adminsPerCourse && user.isInternal) role = 'ADMIN';
            else if (countTutors < tutorsPerCourse && user.isInternal) role = 'TUTOR';
            else role = 'STUDENT';

            courseUser = randomCourseUser(
              new mongoose.Types.ObjectId(course._id),
              new mongoose.Types.ObjectId(user._id),
              role,
            );
            if (courseUser.role === 'ADMIN') countAdmins++;
            if (courseUser.role === 'TUTOR') countTutors++;
            courseUsers.push(courseUser);
          }
        }
      }
    }
  }

  return { courseUsers };
};
