import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface UserType {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  password?: string;
  firebaseUid: string;
  postulantId: string;
  isInternal: boolean;
  isActive: boolean;
}

const userSchema = new Schema<UserType, Model<UserType>>(
  {
    firebaseUid: {
      type: String,
      required: true,
    },
    postulantId: {
      type: String,
      required: true,
      // ref: 'Postulant', MUST BE UNCOMMENTED WHEN POSTULANT RESOURCE IS DONE
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
  },
  { timestamps: true },
);

userSchema.plugin(paginate);

export default mongoose.model<UserType, mongoose.PaginateModel<UserType>>('User', userSchema);
