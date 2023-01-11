import { addDays, addMonths, startOfDay, subMonths } from 'date-fns';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { CourseType } from '../../../src/models/course';

const today = new Date();
const startToday = startOfDay(today);
const endToday = startOfDay(today);

const courses: CourseType[] = [
  // EXTERNAL
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    name: 'BaSP 2024',
    description: `Become a Software Professional ${subMonths(
      startToday,
      5,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // SOON
    inscriptionStartDate: addMonths(startToday, 2),
    inscriptionEndDate: addMonths(endToday, 3),
    startDate: addMonths(addDays(startToday, 1), 3),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    name: 'BaSP 2023',
    description: `Become a Software Professional ${startToday.getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // OPEN_INSCRIPTION
    inscriptionStartDate: startToday,
    inscriptionEndDate: addMonths(endToday, 1),
    startDate: addDays(addMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    name: 'BaSP 2022',
    description: `Become a Quality Assurance ${addDays(
      subMonths(startToday, 1),
      1,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // IN_PROGRESS
    inscriptionStartDate: subMonths(startToday, 2),
    inscriptionEndDate: subMonths(endToday, 1),
    startDate: addDays(subMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    name: 'BaSP 2021',
    description: `Become a Software Professional ${subMonths(
      startToday,
      5,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // COMPLETED
    inscriptionStartDate: subMonths(startToday, 7),
    inscriptionEndDate: subMonths(endToday, 6),
    startDate: subMonths(startToday, 5),
    endDate: subMonths(endToday, 1),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c010'),
    name: 'BaQA 2024',
    description: `Become a Software Professional ${subMonths(
      startToday,
      5,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // SOON
    inscriptionStartDate: addMonths(startToday, 2),
    inscriptionEndDate: addMonths(endToday, 3),
    startDate: addMonths(addDays(startToday, 1), 3),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c011'),
    name: 'BaQA 2023',
    description: `Become a Software Professional ${startToday.getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // OPEN_INSCRIPTION
    inscriptionStartDate: startToday,
    inscriptionEndDate: addMonths(endToday, 1),
    startDate: addDays(addMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c012'),
    name: 'BaQA 2022',
    description: `Become a Quality Assurance ${addDays(
      subMonths(startToday, 1),
      1,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // IN_PROGRESS
    inscriptionStartDate: subMonths(startToday, 2),
    inscriptionEndDate: subMonths(endToday, 1),
    startDate: addDays(subMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c013'),
    name: 'BaQA 2021',
    description: `Become a Software Professional ${subMonths(
      startToday,
      5,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // COMPLETED
    inscriptionStartDate: subMonths(startToday, 7),
    inscriptionEndDate: subMonths(endToday, 6),
    startDate: subMonths(startToday, 5),
    endDate: subMonths(endToday, 1),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c020'),
    name: 'BaSD 2024',
    description: `Become a Software Professional ${subMonths(
      startToday,
      5,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // SOON
    inscriptionStartDate: addMonths(startToday, 2),
    inscriptionEndDate: addMonths(endToday, 3),
    startDate: addMonths(addDays(startToday, 1), 3),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c021'),
    name: 'BaSD 2023',
    description: `Become a Software Professional ${startToday.getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // OPEN_INSCRIPTION
    inscriptionStartDate: startToday,
    inscriptionEndDate: addMonths(endToday, 1),
    startDate: addDays(addMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c022'),
    name: 'BaSD 2022',
    description: `Become a Quality Assurance ${addDays(
      subMonths(startToday, 1),
      1,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // IN_PROGRESS
    inscriptionStartDate: subMonths(startToday, 2),
    inscriptionEndDate: subMonths(endToday, 1),
    startDate: addDays(subMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c023'),
    name: 'BaSD 2021',
    description: `Become a Software Professional ${subMonths(
      startToday,
      5,
    ).getFullYear()} edition.`,
    admissionTests: [
      new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
      new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    ],
    // COMPLETED
    inscriptionStartDate: subMonths(startToday, 7),
    inscriptionEndDate: subMonths(endToday, 6),
    startDate: subMonths(startToday, 5),
    endDate: subMonths(endToday, 1),
    type: 'FULL',
    isInternal: false,
    isActive: true,
  },
  // INTERNAL
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c004'),
    name: 'React Native',
    description: faker.lorem.sentences(3),
    admissionTests: [new mongoose.Types.ObjectId('1e063109a88495b45758c000')],
    // SOON
    inscriptionStartDate: addMonths(startToday, 1),
    inscriptionEndDate: addMonths(endToday, 2),
    startDate: addMonths(addDays(startToday, 1), 2),
    endDate: addMonths(endToday, 4),
    type: 'EXPRESS',
    isInternal: true,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c005'),
    name: 'Angular',
    description: faker.lorem.sentences(3),
    admissionTests: [new mongoose.Types.ObjectId('1e063109a88495b45758c000')],
    // OPEN_INSCRIPTION
    inscriptionStartDate: startToday,
    inscriptionEndDate: addMonths(endToday, 1),
    startDate: addDays(addMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'EXPRESS',
    isInternal: true,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Vue',
    description: faker.lorem.sentences(3),
    admissionTests: [new mongoose.Types.ObjectId('1e063109a88495b45758c000')],
    // IN_PROGRESS
    inscriptionStartDate: subMonths(startToday, 2),
    inscriptionEndDate: subMonths(endToday, 1),
    startDate: addDays(subMonths(startToday, 1), 1),
    endDate: addMonths(endToday, 7),
    type: 'EXPRESS',
    isInternal: true,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c007'),
    name: 'Flutter',
    description: faker.lorem.sentences(3),
    admissionTests: [new mongoose.Types.ObjectId('1e063109a88495b45758c000')],
    // COMPLETED
    inscriptionStartDate: subMonths(startToday, 7),
    inscriptionEndDate: subMonths(endToday, 6),
    startDate: subMonths(startToday, 5),
    endDate: subMonths(endToday, 1),
    type: 'EXPRESS',
    isInternal: true,
    isActive: true,
  },
];

export default courses;
