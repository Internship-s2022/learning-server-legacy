import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { CourseType } from '../../src/models/course';
import { ModuleType } from '../../src/models/module';
import { padMessage } from '../utils';

const randomContents = (amount: number) => {
  const contents: string[] = [];
  for (let i = 0; i < amount; i++) {
    contents[i] = faker.lorem.word({ length: { min: 3, max: 24 } });
  }
  return contents;
};

const today = new Date();

const randomModule = (course: CourseType, index: number): ModuleType => {
  return {
    _id: new mongoose.Types.ObjectId(),
    course: course._id as mongoose.Types.ObjectId,
    name: `Módulo ${index + 1}`,
    description: faker.lorem.sentence(6),
    status:
      course.inscriptionEndDate <= today
        ? course.endDate <= today
          ? 'COMPLETED'
          : 'IN_PROGRESS'
        : 'PENDING',
    type: faker.helpers.arrayElement(['DEV', 'QA', 'UX/UI', 'GENERAL']),
    groups: [],
    contents: randomContents(10),
    isActive: true,
  };
};

export const generateRandomModules = (amount: number, courses: CourseType[]) => {
  console.log('\x1b[36m', padMessage('⚡️ Generating Random Modules'));

  const modules: ModuleType[] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    if (today >= course.startDate) {
      for (let m = 0; m < amount; m++) {
        const module = randomModule(courses[c], m);
        modules.push(module);
      }
    }
  }

  return { modules };
};
