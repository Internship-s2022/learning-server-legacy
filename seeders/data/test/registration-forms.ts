import mongoose from 'mongoose';

import { RegistrationFormType } from '../../../src/models/registration-form';
import courses from './courses';

const registrationForms: RegistrationFormType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    // TO-DO: Update with the population
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c000') as unknown as string,
    title: `Formulario de ingreso - ${courses[0].name}`,
    description: 'Este formulario es para la inscripcion del proximo curso de radium',
    views: [
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
        name: 'General',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
        name: 'Redes',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'),
        name: 'Facultad',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439015'),
        name: 'Conocidos',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439016'),
        name: 'Homepage',
      },
    ],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('2e063109a88495b45758ccd2'),
    // TO-DO: Update with the population of the course
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c001') as unknown as string,
    title: `Formulario de ingreso - ${courses[1].name}`,
    description: 'Este formulario es para la inscripcion del proximo curso de radium',
    views: [
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
        name: 'General',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439023'),
        name: 'Redes',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439024'),
        name: 'Facultad',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439025'),
        name: 'Conocidos',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439026'),
        name: 'Homepage',
      },
    ],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('2e063109a88495b45758ccd3'),
    // TO-DO: Update with the population
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c002') as unknown as string,
    title: `Formulario de ingreso - ${courses[2].name}`,
    description: 'Este formulario es para la inscripcion del proximo curso de radium',
    views: [
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439032'),
        name: 'General',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439033'),
        name: 'Redes',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439034'),
        name: 'Facultad',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439035'),
        name: 'Conocidos',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439036'),
        name: 'Homepage',
      },
    ],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('2e063109a88495b45758ccd4'),
    // TO-DO: Update with the population
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c003') as unknown as string,
    title: `Formulario de ingreso - ${courses[3].name}`,
    description: 'Este formulario es para la inscripcion del proximo curso de radium',
    views: [
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439042'),
        name: 'General',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439043'),
        name: 'Redes',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439044'),
        name: 'Facultad',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439045'),
        name: 'Conocidos',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439046'),
        name: 'Homepage',
      },
    ],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('2e063109a88495b45758ccd5'),
    // TO-DO: Update with the population
    courseId: new mongoose.Types.ObjectId('1e063109a88495b45758c004') as unknown as string,
    title: `Formulario de ingreso - ${courses[4].name}`,
    description: 'Este formulario es para la inscripcion del proximo curso de radium',
    views: [
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439052'),
        name: 'General',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439053'),
        name: 'Redes',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439054'),
        name: 'Facultad',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439055'),
        name: 'Conocidos',
      },
      {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439056'),
        name: 'Homepage',
      },
    ],
    isActive: true,
  },
];

export default registrationForms;
