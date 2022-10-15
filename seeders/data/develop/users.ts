import mongoose from 'mongoose';

import { UserType } from '../../../src/models/user';

const users: UserType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799400000'),
    postulantId: new mongoose.Types.ObjectId('607f1f77bcf86cd799400000') as unknown as string,
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN11',
    isInternal: true,
    isActive: true,
  },
];

export default users;
