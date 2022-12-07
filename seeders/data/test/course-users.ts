import mongoose from 'mongoose';

import { CourseUserType } from '../../../src/models/course-user';

const courseUsers: CourseUserType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400000'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    user: new mongoose.Types.ObjectId('507f1f77bcf86cd799400000'),
    role: 'ADMIN',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    user: new mongoose.Types.ObjectId('507f1f77bcf86cd799400001'),
    role: 'TUTOR',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    user: new mongoose.Types.ObjectId('507f1f77bcf86cd799400002'),
    role: 'STUDENT',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400003'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    user: new mongoose.Types.ObjectId('507f1f77bcf86cd799400003'),
    role: 'STUDENT',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400004'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    user: new mongoose.Types.ObjectId('507f1f77bcf86cd799400004'),
    role: 'STUDENT',
    isActive: false,
  },
];

export default courseUsers;
