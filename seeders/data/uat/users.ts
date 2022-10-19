import mongoose from 'mongoose';

import { UserType } from '../../../src/models/user';

const users: UserType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400000'),
    postulantId: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN11',
    isInternal: true,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400001'),
    postulantId: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN12',
    isInternal: true,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400002'),
    postulantId: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN13',
    isInternal: true,
    isActive: true,
  },
];

export default users;
