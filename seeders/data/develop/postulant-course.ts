import mongoose from 'mongoose';

import { PostulantCourseType } from '../../../src/models/postulant-course';

const postulantCourse: PostulantCourseType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400000'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    admissionResults: [
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400000'),
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001'),
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    answer: [
      { question: new mongoose.Types.ObjectId('636d603af4779c11ba8f6009') },
      {
        question: new mongoose.Types.ObjectId('636d603af4779c11ba8f6001'),
        value: 'This is an answer',
      },
      {
        question: new mongoose.Types.ObjectId('636d603af4779c11ba8f6006'),
        value: ['Argentina'],
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    admissionResults: [
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400003'),
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    answer: [
      {
        question: new mongoose.Types.ObjectId('636d603af4779c11ba8f6001'),
        value: 'This is an answer',
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    admissionResults: [
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400004'),
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400005'),
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    answer: [
      {
        question: new mongoose.Types.ObjectId('636d603af4779c11ba8f6010'),
        value: ['Tarde', 'Indistinto'],
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400003'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    admissionResults: [
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400006'),
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400007'),
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    answer: [],
  },
];

export default postulantCourse;
