import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    required: true,
  },
  lastName: {
    required: true,
  },
  email: {
    required: true,
  },
  password: {
    required: true,
  },
});

export default mongoose.model('User', userSchema);
