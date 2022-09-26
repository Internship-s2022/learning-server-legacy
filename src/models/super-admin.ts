import { InferSchemaType, model, Schema } from 'mongoose';

const superAdminSchema = new Schema({
  firebaseUid: { type: String, required: false },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
});

export type superAdmin = InferSchemaType<typeof superAdminSchema>;

export default model('SuperAdmin', superAdminSchema);
