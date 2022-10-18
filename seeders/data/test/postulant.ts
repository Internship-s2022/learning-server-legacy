import mongoose from 'mongoose';

import { PostulantType } from '../../../src/models/postulant';

const postulantTests: PostulantType[] = [
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    firstName: 'Agustin',
    lastName: 'Chazarreta',
    dni: '37208583',
    phone: '3415444444',
    email: 'agus@gmail.com',
    location: 'Rosario',
    birthDate: '2023-01-05T20:17:04.581Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    firstName: 'Iara',
    lastName: 'Cresenti',
    dni: '37208584',
    phone: '3415666666',
    email: 'agus@gmail.com',
    location: 'Rosario',
    birthDate: '2022-01-05T20:17:04.581Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firstName: 'Guido',
    lastName: 'Cerioni',
    dni: '37208585',
    phone: '3415777777',
    email: 'agus@gmail.com',
    location: 'Rosario',
    birthDate: '2021-01-05T20:17:04.581Z',
    isActive: true,
  },
];

export default postulantTests;
