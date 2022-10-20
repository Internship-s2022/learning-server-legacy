import mongoose from 'mongoose';

import { PostulantType } from '../../../src/models/postulant';

const postulants: PostulantType[] = [
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    firstName: 'Franco',
    lastName: 'Marini',
    dni: '33456456',
    phone: '3415444444',
    email: 'franco.marini@radiumrocket.com',
    location: 'Rosario',
    birthDate: '2023-01-05T20:17:04.581Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    firstName: 'Agustin',
    lastName: 'Chazarreta',
    dni: '37208583',
    phone: '3415444444',
    email: 'agustin.chazaretta@gmail.com',
    location: 'Rosario',
    birthDate: '2023-01-05T20:17:04.581Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firstName: 'Guido',
    lastName: 'Cerioni',
    dni: '41086477',
    phone: '3415777777',
    email: 'guido.cerioni@gmail.com',
    location: 'Rosario',
    birthDate: '2021-01-05T20:17:04.581Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    firstName: 'Iara',
<<<<<<< HEAD
    lastName: 'Criscenti',
    dni: '41343398',
=======
    lastName: 'Cresenti',
    dni: '389783<s67',
>>>>>>> 57a98c8 (RL-11: Update seeders)
    phone: '3415666666',
    email: 'iara.criscenti@hotmail.com',
    location: 'Rosario',
    birthDate: '2022-01-05T20:17:04.581Z',
    isActive: true,
  },
];

export default postulants;
