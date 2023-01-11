import _ from 'lodash';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { CourseType } from '../../src/models/course';
import { CourseUserType } from '../../src/models/course-user';
import { ModuleType } from '../../src/models/module';
import { ReportType } from '../../src/models/report';
import { padMessage } from '../utils';

const today = new Date();

const randomReport = (module: ModuleType, courseUser: mongoose.Types.ObjectId): ReportType => {
  return {
    _id: new mongoose.Types.ObjectId(),
    module: module._id as mongoose.Types.ObjectId,
    courseUser: courseUser,
    exams: [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Problemática',
        grade: module.status === 'COMPLETED' ? faker.datatype.number({ min: 1, max: 10 }) : 0,
      },
    ],
    assistance: faker.datatype.boolean(),
  };
};

export const generateRandomReports = (
  courses: CourseType[],
  modules: ModuleType[],
  courseUsers: CourseUserType[],
) => {
  console.log('\x1b[36m', padMessage('⚡️ Generating Random Reports'));

  const reports: ReportType[] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    const cModules = modules.filter((mod) => mod.course === course._id);
    const cUsers = courseUsers.filter(
      (cUser) => cUser.course.toString() === course?._id?.toString(),
    );
    const students = cUsers.filter((cUser) => cUser.role === 'STUDENT');

    if (today >= course.startDate) {
      for (let m = 0; m < cModules.length; m++) {
        const module = cModules[m];

        for (let s = 0; s < students.length; s++) {
          const student = students[s];
          const report = randomReport(module, student._id as mongoose.Types.ObjectId);
          reports.push(report);
        }
      }
    }
  }

  return { reports };
};
