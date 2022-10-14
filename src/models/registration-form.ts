import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

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

registrationFormSchema.plugin(paginate);

export default mongoose.model<RegistrationFormType, mongoose.PaginateModel<RegistrationFormType>>(
  'RegistrationForm',
  registrationFormSchema,
);
