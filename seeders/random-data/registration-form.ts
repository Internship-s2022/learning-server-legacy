import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { QuestionType } from 'src/models/question';

import { CourseType } from '../../src/models/course';
import { RegistrationFormType } from '../../src/models/registration-form';
import { padMessage } from '../utils';

const randomRegistrationForm = (course: CourseType): RegistrationFormType => {
  return {
    _id: new mongoose.Types.ObjectId(),
    course: course._id || new mongoose.Types.ObjectId(course._id),
    title: `Formulario - ${course.name}`,
    description: faker.lorem.paragraph(5),
    views: [
      { _id: new mongoose.Types.ObjectId(), name: 'General' },
      { _id: new mongoose.Types.ObjectId(), name: 'Redes' },
      { _id: new mongoose.Types.ObjectId(), name: 'Facultad' },
      { _id: new mongoose.Types.ObjectId(), name: 'Conocidos' },
      { _id: new mongoose.Types.ObjectId(), name: 'Homepage' },
    ],
    isActive: true,
  };
};

const generateGeneralQuestions = (
  registrationForm: mongoose.Types.ObjectId,
  view: mongoose.Types.ObjectId,
): QuestionType[] => {
  return [
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Nombre',
      type: 'SHORT_ANSWER',
      view,
      key: 'firstName',
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Apellido',
      type: 'SHORT_ANSWER',
      view,
      key: 'lastName',
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Email',
      type: 'SHORT_ANSWER',
      view,
      key: 'email',
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Fecha de nacimiento',
      type: 'SHORT_ANSWER',
      view,
      key: 'birthDate',
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'DNI',
      type: 'SHORT_ANSWER',
      view,
      key: 'dni',
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'País',
      type: 'DROPDOWN',
      options: [
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Argentina',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Uruguay',
        },
      ],
      view,
      key: 'location',
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Teléfono',
      type: 'SHORT_ANSWER',
      view,
      key: 'phone',
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Lugar donde te enteraste del curso',
      type: 'MULTIPLE_CHOICES',
      options: [
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Instagram',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Facebook',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Twitter',
        },
      ],
      view,
      isRequired: false,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Disponibilidad horaria',
      type: 'CHECKBOXES',
      options: [
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Manana',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Tarde',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: 'Indistinto',
        },
      ],
      view,
      isRequired: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: 'Describite en un párrafo',
      type: 'PARAGRAPH',
      view,
      isRequired: true,
    },
  ];
};

const generateRandomQuestions = (
  registrationForm: mongoose.Types.ObjectId,
  view: mongoose.Types.ObjectId,
): QuestionType[] => {
  return [
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: faker.lorem.sentence(),
      type: 'SHORT_ANSWER',
      view,
      isRequired: faker.datatype.boolean(),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: faker.lorem.sentence(),
      type: 'DROPDOWN',
      options: [
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
      ],
      view,
      isRequired: faker.datatype.boolean(),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: faker.lorem.sentence(),
      type: 'MULTIPLE_CHOICES',
      options: [
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
      ],
      view,
      isRequired: faker.datatype.boolean(),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: faker.lorem.sentence(),
      type: 'CHECKBOXES',
      options: [
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          value: faker.lorem.word(),
        },
      ],
      view,
      isRequired: faker.datatype.boolean(),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      registrationForm,
      title: faker.lorem.sentence(),
      type: 'PARAGRAPH',
      view,
      isRequired: faker.datatype.boolean(),
    },
  ];
};

export const generateRegistrationFormPerCourse = (courses: CourseType[]) => {
  console.log('\x1b[36m', padMessage('⚡️ Adding Forms in Courses'));
  const registrationForms: RegistrationFormType[] = [];
  const questions: QuestionType[][] = [];

  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    const registrationForm = randomRegistrationForm(course);
    registrationForms.push(registrationForm);
    console.log('\x1b[36m', padMessage(`⚡️ Questions in ${course.name}`));
    registrationForm.views.forEach(({ _id, name }) => {
      if (name === 'General') {
        questions.push(
          generateGeneralQuestions(
            registrationForm._id as mongoose.Types.ObjectId,
            _id as mongoose.Types.ObjectId,
          ),
        );
      } else {
        questions.push(
          generateRandomQuestions(
            registrationForm._id as mongoose.Types.ObjectId,
            _id as mongoose.Types.ObjectId,
          ),
        );
      }
    });
  }

  return { registrationForms, questions: questions.flat() };
};
