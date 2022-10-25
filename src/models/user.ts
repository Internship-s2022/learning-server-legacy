import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface UserType {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  password?: string;
  firebaseUid: string;
  postulantId: mongoose.Types.ObjectId;
  isInternal: boolean;
  isActive: boolean;
  isNewUser: boolean;
}

const userSchema = new Schema<UserType, Model<UserType>>(
  {
    firebaseUid: {
      type: String,
      required: true,
    },
    postulantId: {
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
  },
  { timestamps: true },
);

userSchema.plugin(paginate);

export default mongoose.model<UserType, mongoose.PaginateModel<UserType>>('User', userSchema);
