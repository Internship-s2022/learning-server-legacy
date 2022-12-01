import mongoose from 'mongoose';

import { AdmissionResultType } from '../../../src/models/admission-result';

const admissionResults: AdmissionResultType[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400000'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    score: 8,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    score: 9,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    score: 0,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400003'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    score: 0,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400004'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    score: 0,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400005'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    score: 0,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400006'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c000'),
    score: 2,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400007'),
    admissionTest: new mongoose.Types.ObjectId('1e063109a88495b45758c001'),
    score: 5,
  },
];

export default admissionResults;
