import mongoose from 'mongoose';

import { SuperAdminType } from '../../../src/models/super-admin';

const superAdmins: SuperAdminType[] = [
  {
    _id: new mongoose.Types.ObjectId('5e063109a88495b45758ccd1'),
    firebaseUid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN15',
    firstName: 'Super',
    lastName: 'Admin',
    email: process.env.SUPER_ADMIN_EMAIL || 'super.admin@radiumrocket.com',
    isActive: true,
  },
];

export default superAdmins;
