import mongoose from 'mongoose';

import { QuestionType } from '../../../src/models/question';

const questions: QuestionType[] = [
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6001'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Question 2',
    type: 'DROPDOWN',
    options: [
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6001'),
        value: 'Option 1',
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Option 2',
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6003'),
        value: 'Option 3',
        isActive: true,
      },
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6002'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Question 2',
    type: 'DROPDOWN',
    options: [
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6001'),
        value: 'Option 1',
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Option 2',
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6003'),
        value: 'Option 3',
        isActive: true,
      },
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6003'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    title: 'Question 2',
    type: 'SHORT_ANSWER',
    options: [],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6004'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    title: 'Question 2',
    type: 'SHORT_ANSWER',
    options: [],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439023'),
    isRequired: true,
  },
];

export default questions;
