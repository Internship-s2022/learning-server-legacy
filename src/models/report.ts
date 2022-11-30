import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface ExamType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  grade: number;
}

export interface ReportType {
  _id?: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  courseUser: mongoose.Types.ObjectId;
  exams: ExamType[];
  assistance: boolean;
}

export interface ReportIdType extends ReportType {
  _id: mongoose.Types.ObjectId;
}

export interface ReportDocument extends ReportType, Document {
  _id?: mongoose.Types.ObjectId;
}

const reportSchema = new Schema<ReportType, Model<ReportType>>(
  {
    module: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Module',
    },
    courseUser: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'CourseUser',
    },
    exams: {
      type: [
        {
          name: { type: String, required: true },
          grade: { type: Number, required: true },
        },
      ],
      required: true,
    },
    assistance: {
      type: Schema.Types.Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

reportSchema.plugin(aggregatePaginate);

export default mongoose.model<ReportType, mongoose.AggregatePaginateModel<ReportDocument>>(
  'Report',
  reportSchema,
);
