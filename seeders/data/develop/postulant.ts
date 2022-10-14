import mongoose from 'mongoose';

import { PostulantType } from '../../../src/models/postulant';

const postulantTests: PostulantType[] = [
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    name: 'Agustin',
    lastName: 'Chazarreta',
    dni: '37208583',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    name: 'Iara',
    lastName: 'Cresenti',
    dni: '37208584',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    name: 'Guido',
    lastName: 'Cerioni',
    dni: '37208585',
    isActive: true,
  },
];

export default postulantTests;
