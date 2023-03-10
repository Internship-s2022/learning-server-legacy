import _ from 'lodash';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { CourseType } from '../../src/models/course';
import { CourseUserType } from '../../src/models/course-user';
import { GroupType } from '../../src/models/group';
import { ModuleType } from '../../src/models/module';
import { padMessage } from '../utils';

const today = new Date();

const randomGroup = (
  course: CourseType,
  moduleIndex: number,
  index: number,
  modules: mongoose.Types.ObjectId[],
  courseUsers: mongoose.Types.ObjectId[],
): GroupType => {
  return {
    _id: new mongoose.Types.ObjectId(),
    course: course._id as mongoose.Types.ObjectId,
    name: `Grupo ${index + 1}`,
    // name: `Grupo ${index + 1} Etapa ${moduleIndex + 1}`,
    modules,
    type: faker.helpers.arrayElement(['DEV', 'QA', 'UX/UI', 'GENERAL']),
    courseUsers,
    isActive: true,
  };
};

export const generateRandomGroups = (
  courses: CourseType[],
  modules: ModuleType[],
  courseUsers: CourseUserType[],
) => {
  console.log('\x1b[36m', padMessage('⚡️ Generating Random Groups'));

  const groups: GroupType[] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    if (today >= course.startDate) {
      let countGroups = 0;
      const cModules = modules.filter((mod) => mod.course === course._id);
      const cUsers = courseUsers.filter(
        (cUser) => cUser.course.toString() === courses[c]?._id?.toString(),
      );
      const tutors = cUsers.filter((cUser) => cUser.role === 'TUTOR');
      const students = cUsers.filter((cUser) => cUser.role === 'STUDENT');
      const chunkedModules = _.chunk(cModules, 5);

      for (let mChunked = 0; mChunked < chunkedModules.length; mChunked++) {
        const modules = chunkedModules[mChunked];
        const shuffleStudents = _.shuffle(students);
        const studentGroups = _.chunk(shuffleStudents, 10);

        for (let sChunked = 0; sChunked < studentGroups.length; sChunked++) {
          const chunkedGroups = [
            ...studentGroups[sChunked].map(({ _id }) => _id),
            tutors[_.random(0, tutors.length - 1)]._id,
          ] as mongoose.Types.ObjectId[];
          const group = randomGroup(
            courses[c],
            mChunked,
            countGroups,
            modules.map(({ _id }) => _id as mongoose.Types.ObjectId),
            chunkedGroups,
          );
          countGroups++;
          groups.push(group);
          modules.forEach((module) => module.groups.push(group._id as mongoose.Types.ObjectId));
        }
      }
    }
  }

  return { groups };
};
