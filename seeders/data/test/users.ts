import mongoose from 'mongoose';

import { UserType } from '../../../src/models/user';

const users: UserType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400004'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c004'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN15',
    isInternal: true,
    isActive: true,
    isNewUser: false,
    email: 'julian.demeglio@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400000'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN11',
    isInternal: true,
    isActive: true,
    isNewUser: false,
    email: 'franco.marini@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400001'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN12',
    isInternal: true,
    isActive: true,
    isNewUser: false,
    email: 'agustin.chazaretta@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400002'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN13',
    isInternal: true,
    isActive: true,
    isNewUser: false,
    email: 'guido.cerioni@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400003'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN14',
    isInternal: true,
    isActive: true,
    isNewUser: false,
    email: 'iara.criscenti@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400005'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c005'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN16',
    isInternal: true,
    isActive: true,
    isNewUser: false,
    email: 'facundo.cosentino@radiumrocket.com',
  },
];

export default users;
