import mongoose, { Model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface PostulantType {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  birthDate: string;
  location: string;
  dni: string;
  email: string;
  phone: string;
  isActive: boolean;
}

type PostulantDocument = PostulantType & mongoose.Document;

const postulantSchema = new Schema<PostulantType, Model<PostulantType>>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dni: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

postulantSchema.plugin(aggregatePaginate);

export default mongoose.model<PostulantType, mongoose.AggregatePaginateModel<PostulantDocument>>(
  'Postulant',
  postulantSchema,
);
