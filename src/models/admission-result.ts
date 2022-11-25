import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { AdmissionTestType } from './admission-test';

export interface AdmissionResultType {
  _id?: mongoose.Types.ObjectId;
  admissionTest: mongoose.Types.ObjectId;
  score: number;
}
export interface PopulatedAdmissionResultType {
  _id?: mongoose.Types.ObjectId;
  admissionTest: AdmissionTestType;
  score: number;
}

const AdmissionResultSchema = new Schema<AdmissionResultType, Model<AdmissionResultType>>(
  {
    admissionTest: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AdmissionTest',
    },
    score: {
      type: Number,
      default: 0, //means no-corrected
    },
  },
  { timestamps: true },
);

AdmissionResultSchema.plugin(paginate);

export default mongoose.model<AdmissionResultType, mongoose.PaginateModel<AdmissionResultType>>(
  'AdmissionResult',
  AdmissionResultSchema,
);
