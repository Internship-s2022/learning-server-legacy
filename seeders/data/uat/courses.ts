import mongoose from 'mongoose';

import { CourseType } from '../../../src/models/course';

const today = new Date();
const daysDiff = 40;

const courses: CourseType[] = [
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    name: `BASP ${today.getFullYear()}`,
    description: 'Be a software developer',
    inscriptionStartDate: new Date(new Date().setDate(today.getDate() + daysDiff * 1)),
    inscriptionEndDate: new Date(new Date().setDate(today.getDate() + daysDiff * 2)),
    startDate: new Date(new Date().setDate(today.getDate() + daysDiff * 2)),
    endDate: new Date(new Date().setDate(today.getDate() + daysDiff * 6)),
    type: 'Software Dev',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    name: 'React Native',
    description: 'Curso express de React Native',
    inscriptionStartDate: new Date(new Date().setDate(today.getDate() + daysDiff * 3)),
    inscriptionEndDate: new Date(new Date().setDate(today.getDate() + daysDiff * 4)),
    startDate: new Date(new Date().setDate(today.getDate() + daysDiff * 4)),
    endDate: new Date(new Date().setDate(today.getDate() + daysDiff * 7)),
    type: 'Express',
    isInternal: true,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    name: 'Vue',
    description: 'Curso express de Vue',
    inscriptionStartDate: new Date(new Date().setDate(today.getDate() + daysDiff * 3)),
    inscriptionEndDate: new Date(new Date().setDate(today.getDate() + daysDiff * 4)),
    startDate: new Date(new Date().setDate(today.getDate() + daysDiff * 4)),
    endDate: new Date(new Date().setDate(today.getDate() + daysDiff * 7)),
    type: 'Express',
    isInternal: true,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c004'),
    name: `QA ${today.getFullYear()}`,
    description: 'Be a software developer',
    inscriptionStartDate: new Date(new Date().setDate(today.getDate() + daysDiff * 1)),
    inscriptionEndDate: new Date(new Date().setDate(today.getDate() + daysDiff * 2)),
    startDate: new Date(new Date().setDate(today.getDate() + daysDiff * 2)),
    endDate: new Date(new Date().setDate(today.getDate() + daysDiff * 6)),
    type: 'Software Dev',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c005'),
    name: 'Dev 2021',
    description: 'Become a Software Developer',
    inscriptionStartDate: new Date(new Date().setDate(today.getDate() + daysDiff * 1)),
    inscriptionEndDate: new Date(new Date().setDate(today.getDate() + daysDiff * 2)),
    startDate: new Date(new Date().setDate(today.getDate() + daysDiff * 2)),
    endDate: new Date(new Date().setDate(today.getDate() + daysDiff * 6)),
    type: 'Software Dev',
    isInternal: false,
    isActive: false,
  },
];

export default courses;
