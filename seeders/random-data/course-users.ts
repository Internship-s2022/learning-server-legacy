import mongoose from 'mongoose';

import { CourseType } from '../../src/models/course';
import { CourseUserType, RoleType } from '../../src/models/course-user';
import { UserType } from '../../src/models/user';
import { padMessage } from '../utils';

const adminsPerCourse = 1;
const tutorsPerCourse = parseInt(process.env.RANDOM_TUTORS_PER_COURSE || '5');
const today = new Date();

const randomCourseUser = (
  courseId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  role: RoleType,
): CourseUserType => {
  return {
    _id: new mongoose.Types.ObjectId(),
    course: courseId,
    user: userId,
    role,
    isActive: true,
  };
};

export const generateRandomCourseUsers = (courses: CourseType[], users: UserType[]) => {
  console.log('\x1b[36m', padMessage('⚡️ Generating Users in Courses'));
  const courseUsers: CourseUserType[] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    let countAdmins = 0;
    let countTutors = 0;
    for (let u = 0; u < users.length; u++) {
      const user = users[u];

      if ((course.isInternal && user.isInternal) || !course.isInternal) {
        const courseUser = randomCourseUser(
          new mongoose.Types.ObjectId(course._id),
          new mongoose.Types.ObjectId(user._id),
          'STUDENT',
        );
        if (countAdmins < adminsPerCourse && user.isInternal) {
          courseUser.role = 'ADMIN';
          countAdmins++;
          courseUsers.push(courseUser);
        } else if (countTutors < tutorsPerCourse && user.isInternal) {
          courseUser.role = 'TUTOR';
          countTutors++;
          courseUsers.push(courseUser);
        }

        if (courseUser.role === 'STUDENT' && today >= course.startDate) {
          courseUsers.push(courseUser);
        }
      }
    }
  }

  return { courseUsers };
};
