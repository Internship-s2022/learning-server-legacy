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
    postulantId: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN12',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400002'),
    postulantId: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN13',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400003'),
    postulantId: new mongoose.Types.ObjectId('1e063109a88495b45758c003'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN14',
    isInternal: false,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400004'),
    postulantId: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN15',
    isInternal: false,
    isActive: true,
  },
];

export default users;
