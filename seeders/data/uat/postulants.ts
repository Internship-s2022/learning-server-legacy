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
    country: 'Argentina',
    birthDate: '1998-01-05T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    firstName: 'Agustin',
    lastName: 'Chazarreta',
    dni: '37208583',
    phone: '3415444444',
    email: 'agustin.chazaretta@gmail.com',
    country: 'Argentina',
    birthDate: '1998-01-05T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firstName: 'Guido',
    lastName: 'Cerioni',
    dni: '41086477',
    phone: '3415777777',
    email: 'guido.cerioni@gmail.com',
    country: 'Argentina',
    birthDate: '1998-01-05T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    firstName: 'Iara',
    lastName: 'Criscenti',
    dni: '41343398',
    phone: '3415666666',
    email: 'iara.criscenti@hotmail.com',
    country: 'Argentina',
    birthDate: '1998-01-05T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c004'),
    firstName: 'Julian',
    lastName: 'Demeglio',
    dni: '38890098',
    phone: '3415666666',
    email: 'julian.demeglio@radiumrocket.com',
    country: 'Argentina',
    birthDate: '1998-01-05T00:00:00.000Z',
    isActive: true,
  },
];

export default postulants;
