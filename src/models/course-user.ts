import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

type RoleType = 'ADMIN' | 'TUTOR' | 'AUXILIARY' | 'STUDENT';

export interface CourseUserType {
  _id?: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: RoleType;
  isActive: boolean;
}

interface CourseUserDocument extends CourseUserType, Document {
  _id?: mongoose.Types.ObjectId;
}

const CourseUserSchema = new Schema<CourseUserType, Model<CourseUserType>>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
      unique: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: false,
    },
    role: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

CourseUserSchema.plugin(aggregatePaginate);

export default mongoose.model<CourseUserType, mongoose.AggregatePaginateModel<CourseUserDocument>>(
  'CourseUser',
  CourseUserSchema,
);
