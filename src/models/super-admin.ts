import mongoose, { Model, model, Schema } from 'mongoose';

export interface SuperAdminType {
  _id?: mongoose.Types.ObjectId;
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

export default model('SuperAdmin', superAdminSchema);
