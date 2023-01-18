import mongoose from 'mongoose';

import { QuestionType } from '../../../src/models/question';

const questions: QuestionType[] = [
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6001'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Nombre',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6002'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Apellido',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6003'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Email',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6004'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Fecha de nacimiento',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6005'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'DNI',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6006'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Pais',
    type: 'DROPDOWN',
    options: [
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6001'),
        value: 'Argentina',
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Uruguay',
      },
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6007'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Localidad',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6008'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Telefono',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6009'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Lugar donde te enteraste del curso',
    type: 'MULTIPLE_CHOICES',
    options: [
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6001'),
        value: 'Instagram',
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Facebook',
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Twitter',
      },
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    isRequired: false,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6010'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Disponibilidad horaria',
    type: 'CHECKBOXES',
    options: [
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6001'),
        value: 'Manana',
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Tarde',
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Indistinto',
      },
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6011'),
    registrationForm: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Describite en un parrafo',
    type: 'PARAGRAPH',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6012'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'Nombrea',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6013'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'Apellido',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6014'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'Email',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6015'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'Fecha de nacimiento',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6016'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'DNI',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6017'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'Pais',
    type: 'DROPDOWN',
    options: [
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6001'),
        value: 'Argentina',
      },
      {
        _id: new mongoose.Types.ObjectId('636d603af4779000ba8f6002'),
        value: 'Uruguay',
      },
    ],
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6018'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'Localidad',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
  {
    _id: new mongoose.Types.ObjectId('636d603af4779c11ba8f6019'),
    registrationForm: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    title: 'Telefono',
    type: 'SHORT_ANSWER',
    view: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    isRequired: true,
  },
];

export default questions;
