import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface AdmissionTestType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  isActive: boolean;
}

const admissionTestSchema = new Schema<AdmissionTestType, Model<AdmissionTestType>>(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

admissionTestSchema.plugin(paginate);

export default mongoose.model<AdmissionTestType, mongoose.PaginateModel<AdmissionTestType>>(
  'AdmissionTest',
  admissionTestSchema,
);
