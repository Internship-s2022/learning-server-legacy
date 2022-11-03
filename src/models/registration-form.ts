import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

type View = {
  _id?: mongoose.Types.ObjectId;
  name: string;
};

export interface RegistrationFormType {
  _id?: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  views: View[];
  isActive: boolean;
}

interface RegistrationFormDocument extends RegistrationFormType, Document {
  _id?: mongoose.Types.ObjectId;
}

const registrationFormSchema = new Schema<RegistrationFormType, Model<RegistrationFormType>>(
  {
    course: {
      type: Schema.Types.ObjectId,
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

registrationFormSchema.plugin(aggregatePaginate);

export default mongoose.model<
  RegistrationFormType,
  mongoose.AggregatePaginateModel<RegistrationFormDocument>
>('RegistrationForm', registrationFormSchema);
