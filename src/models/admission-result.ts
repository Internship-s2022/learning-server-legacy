import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface AdmissionResultType {
  _id?: mongoose.Types.ObjectId;
  admissionTest: mongoose.Types.ObjectId;
  score: number;
  isActive: boolean;
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
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

AdmissionResultSchema.plugin(paginate);

export default mongoose.model<AdmissionResultType, mongoose.PaginateModel<AdmissionResultType>>(
  'AdmissionResult',
  AdmissionResultSchema,
);
