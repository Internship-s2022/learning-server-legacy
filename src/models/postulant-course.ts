import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface AnswerType {
  _id?: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  value: string;
  isActive: boolean;
}

export interface PostulantCourseType {
  _id?: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  postulant: mongoose.Types.ObjectId;
  answer: AnswerType[];
  admissionResults: mongoose.Types.ObjectId[];
  view: mongoose.Types.ObjectId;
  isActive: boolean;
}

interface PostulantCourseDocument extends PostulantCourseType, Document {
  _id?: mongoose.Types.ObjectId;
}

const PostulantCourseSchema = new Schema<PostulantCourseType, Model<PostulantCourseType>>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
      unique: false,
    },
    postulant: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Postulant',
      unique: false,
    },
    admissionResults: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'AdmissionResult',
      },
    ],
    answer: [
      {
        question: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Question',
        },
        value: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean,
          required: true,
        },
      },
    ],
    view: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

PostulantCourseSchema.plugin(aggregatePaginate);

export default mongoose.model<
  PostulantCourseType,
  mongoose.AggregatePaginateModel<PostulantCourseDocument>
>('PostulantCourse', PostulantCourseSchema);
