import mongoose, { Model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface PostulantType {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  birthDate: string;
  location: string;
  dni: string;
  isActive: boolean;
}

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
  },
  { timestamps: true },
);

postulantSchema.plugin(paginate);

export default mongoose.model<PostulantType, mongoose.PaginateModel<PostulantType>>(
  'PostulantTest',
  postulantSchema,
);
