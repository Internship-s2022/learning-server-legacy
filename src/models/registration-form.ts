import mongoose, { Model } from 'mongoose';

const { Schema } = mongoose;

type View = {
  _id?: mongoose.Types.ObjectId;
  name: string;
};

export interface RegistrationFormType {
  _id?: mongoose.Types.ObjectId;
  courseId: string;
  title: string;
  description: string;
  views: View[];
  isActive: boolean;
}

const registrationFormSchema = new Schema<RegistrationFormType, Model<RegistrationFormType>>(
  {
    courseId: {
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

export default mongoose.model('RegistrationForm', registrationFormSchema);
