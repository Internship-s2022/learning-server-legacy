import mongoose from 'mongoose';

import { AdmissionTestType } from '../../../src/models/admission-test';

const admissionTests: AdmissionTestType[] = [
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    name: 'Figma',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    name: 'Ingles',
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('1e063109a88495b45758c002'),
    name: 'Gorilla test',
    isActive: true,
  },
];

export default admissionTests;
