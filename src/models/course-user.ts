import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

type RoleType = 'ADMIN' | 'TUTOR' | 'AUXILIARY' | 'STUDENT';

export interface CourseUserType {
  _id?: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: RoleType;
  isActive: boolean;
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

CourseUserSchema.plugin(paginate);

export default mongoose.model<CourseUserType, mongoose.PaginateModel<CourseUserType>>(
  'CourseUser',
  CourseUserSchema,
);
