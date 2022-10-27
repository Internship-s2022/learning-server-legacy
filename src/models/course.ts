import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface CourseType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  admissionTestIds: mongoose.Types.ObjectId[];
  inscriptionStartDate: Date;
  inscriptionEndDate: Date;
  startDate: Date;
  endDate: Date;
  type: string;
  description: string;
  isInternal: boolean;
  isActive: boolean;
}

interface CourseDocument extends CourseType, Document {
  _id?: mongoose.Types.ObjectId;
}

const courseSchema = new Schema<CourseType, Model<CourseType>>(
  {
    name: {
      type: String,
      required: true,
    },
    admissionTestIds: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AdmissionTest',
      },
    ],
    inscriptionStartDate: {
      type: Date,
      required: true,
    },
    inscriptionEndDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    isInternal: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

courseSchema.plugin(aggregatePaginate);

export default mongoose.model<CourseType, mongoose.AggregatePaginateModel<CourseDocument>>(
  'Course',
  courseSchema,
);
