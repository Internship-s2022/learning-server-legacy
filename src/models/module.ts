import mongoose, { Document, Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type ModuleTypes = 'DEV' | 'QA' | 'UIUX' | 'GENERAL';

export type ModuleStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface ModuleType {
  _id?: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  name: string;
  description: string;
  status: ModuleStatus;
  type: ModuleTypes;
  groups: mongoose.Types.ObjectId[];
  contents: string[];
  isActive: boolean;
}

export interface ModuleDocument extends ModuleType, Document {
  _id?: mongoose.Types.ObjectId;
}

const moduleSchema = new Schema<ModuleType, Model<ModuleType>>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    groups: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Group',
        },
      ],
      required: false,
    },
    contents: {
      type: [
        {
          type: String,
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

moduleSchema.plugin(aggregatePaginate);

export default mongoose.model<ModuleType, mongoose.AggregatePaginateModel<ModuleDocument>>(
  'Module',
  moduleSchema,
);
