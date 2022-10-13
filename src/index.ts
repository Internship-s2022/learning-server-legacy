import 'express-async-errors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
import app from './app';

const port = process.env.PORT;
const MONGODB_URL = process.env.MONGO_URL || '';

mongoose.connect(MONGODB_URL, (error) => {
  if (error) {
    console.log('🔴 Database error: ', error);
  } else {
    console.log('✅ Database connected');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
});
