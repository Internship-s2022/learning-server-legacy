import mongoose from 'mongoose';

import { UserType } from '../../../src/models/user';

const users: UserType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400000'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN11',
    isInternal: true,
    isActive: true,
    isNewUser: true,
    email: 'franco.marini@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400001'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN12',
    isInternal: false,
    isActive: true,
    isNewUser: true,
    email: 'agustin.chazaretta@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400002'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN13',
    isInternal: false,
    isActive: true,
    isNewUser: true,
    email: 'guido.cerioni@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400003'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN14',
    isInternal: false,
    isActive: true,
    isNewUser: true,
    email: 'iara.criscenti@radiumrocket.com',
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400004'),
    postulant: new mongoose.Types.ObjectId('1e063109a88495b45758c004'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN15',
    isInternal: false,
    isActive: true,
    isNewUser: true,
    email: 'julian.demeglio@radiumrocket.com',
  },
];

export default users;
