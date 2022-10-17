import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface SuperAdminType {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  password?: string;
  firebaseUid: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

const superAdminSchema = new Schema<SuperAdminType, Model<SuperAdminType>>(
  {
    firebaseUid: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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

superAdminSchema.plugin(paginate);

export default mongoose.model<SuperAdminType, mongoose.PaginateModel<SuperAdminType>>(
  'SuperAdmin',
  superAdminSchema,
);
