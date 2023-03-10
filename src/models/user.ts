import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface UserType {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  password?: string;
  firebaseUid: string;
  postulant: mongoose.Types.ObjectId;
  isInternal: boolean;
  isActive: boolean;
  isNewUser: boolean;
  initialPassword?: string;
}

export interface UserDocument extends UserType, Document {
  _id?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<UserType, Model<UserType>>(
  {
    firebaseUid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    postulant: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Postulant',
      unique: false,
    },
    isInternal: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    isNewUser: {
      type: Boolean,
      default: true,
      required: true,
    },
    initialPassword: {
      type: String,
      default: '',
      required: false,
    },
  },
  { timestamps: true },
);

userSchema.plugin(aggregatePaginate);

export default mongoose.model<UserType, mongoose.AggregatePaginateModel<UserDocument>>(
  'User',
  userSchema,
);
