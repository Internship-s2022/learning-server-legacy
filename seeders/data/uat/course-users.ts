import mongoose from 'mongoose';

import { CourseUserType } from '../../../src/models/course-user';

const courseUsers: CourseUserType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400000'),
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799400000'),
    role: 'ADMIN',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001'),
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799400001'),
    role: 'TUTOR',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    userId: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    role: 'STUDENT',
    isActive: true,
  },
];

export default courseUsers;
