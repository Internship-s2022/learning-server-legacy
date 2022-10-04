import mongoose from 'mongoose';

const { Schema } = mongoose;

const registrationFormSchema = new Schema(
  {
    course_id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    views: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

export type RegistrationFormTypes = mongoose.InferSchemaType<typeof registrationFormSchema>;

export default mongoose.model('RegistrationForm', registrationFormSchema);
