import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type Option = {
  _id?: mongoose.Types.ObjectId;
  value: string;
};

export type QuestionTypes =
  | 'SHORT_ANSWER'
  | 'PARAGRAPH'
  | 'DROPDOWN'
  | 'CHECKBOXES'
  | 'MULTIPLE_CHOICES';

export interface QuestionType {
  _id?: mongoose.Types.ObjectId;
  registrationForm?: mongoose.Types.ObjectId;
  title: string;
  type: QuestionTypes;
  options?: Option[];
  view: mongoose.Types.ObjectId;
  isRequired: boolean;
}

interface QuestionDocument extends QuestionType, Document {
  _id?: mongoose.Types.ObjectId;
}

const questionSchema = new Schema<QuestionType, Model<QuestionType>>(
  {
    registrationForm: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'RegistrationForm',
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    options: {
      type: [
        {
          value: {
            type: String,
            required: true,
          },
        },
      ],
      required: false,
    },
    view: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isRequired: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

questionSchema.plugin(aggregatePaginate);

export default mongoose.model<QuestionType, mongoose.AggregatePaginateModel<QuestionDocument>>(
  'Question',
  questionSchema,
);
