import mongoose, { InferSchemaType } from 'mongoose';

const { Schema } = mongoose;

const admissionTestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

export type AdmissionTestTypes = InferSchemaType<typeof admissionTestSchema>;

export default mongoose.model('AdmissionTest', admissionTestSchema);
