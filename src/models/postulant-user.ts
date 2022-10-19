import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import postulantSchema from './postulant';
import userSchema from './user';

export interface PostulantUserType {
  _id?: mongoose.Types.ObjectId;
  email: string;
  postulantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  isActive: boolean;
}

const postulantUserSchema = new Schema<PostulantUserType, Model<PostulantUserType>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: userSchema,
      unique: false,
    },
    postulantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: postulantSchema,
      unique: false,
    },
    email: {
      type: String,
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

postulantUserSchema.plugin(paginate);

export default mongoose.model<PostulantUserType, mongoose.PaginateModel<PostulantUserType>>(
  'PostulantUser',
  postulantUserSchema,
);
