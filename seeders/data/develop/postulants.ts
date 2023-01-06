import mongoose from 'mongoose';

import { PostulantType } from '../../../src/models/postulant';

const postulants: PostulantType[] = [
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    firstName: 'Franco',
    lastName: 'Marini',
    dni: '40905244',
    phone: '3415982821',
    email: 'franco.marini@outlook.com',
    location: 'Argentina',
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
    location: 'Argentina',
    birthDate: '1998-01-05T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firstName: 'Guido',
    lastName: 'Cerioni',
    dni: '41086478',
    phone: '3412288096',
    email: 'guidocerioni98@gmail.com',
    location: 'Argentina',
    birthDate: '1998-05-30T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    firstName: 'Iara',
    lastName: 'Criscenti',
    dni: '41343398',
    phone: '3416016727',
    email: 'iaracriscenti@gmail.com',
    location: 'Argentina',
    birthDate: '1998-08-06T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c004'),
    firstName: 'Julián',
    lastName: 'Demeglio',
    dni: '37815760',
    phone: '3413029721',
    email: 'jdemegliosch@gmail.com',
    location: 'Argentina',
    birthDate: '1994-03-12T00:00:00.000Z',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c005'),
    firstName: 'Facundo',
    lastName: 'Cosentino',
    dni: '38153561',
    phone: '3415500713',
    email: 'facumcosentino@gmail.com',
    location: 'Argentina',
    birthDate: '1994-03-18T00:00:00.000Z',
    isActive: true,
  },
];

export default postulants;
