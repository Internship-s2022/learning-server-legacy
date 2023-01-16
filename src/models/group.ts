import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type GroupTypes = 'DEV' | 'QA' | 'UX/UI' | 'GENERAL';

export interface GroupType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  course: mongoose.Types.ObjectId;
  type: GroupTypes;
  courseUsers: mongoose.Types.ObjectId[];
  modules: mongoose.Types.ObjectId[];
  isActive: boolean;
}

export interface GroupIdType extends GroupType {
  _id: mongoose.Types.ObjectId;
}

export interface GroupDocument extends GroupType, Document {
  _id?: mongoose.Types.ObjectId;
}

const groupSchema = new Schema<GroupType, Model<GroupType>>(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    courseUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
        },
      ],
      required: false,
    },
    modules: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
        },
      ],
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

groupSchema.plugin(aggregatePaginate);

export default mongoose.model<GroupType, mongoose.AggregatePaginateModel<GroupDocument>>(
  'Group',
  groupSchema,
);
