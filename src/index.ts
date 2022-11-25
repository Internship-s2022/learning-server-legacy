import 'express-async-errors';
import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';

import app from './app';

const port = process.env.PORT;
const MONGODB_URL = process.env.MONGO_URL || '';

mongoose.connect(MONGODB_URL, (error) => {
  if (error) {
    console.log('🔴 Database error: ', error);
  } else {
    console.log('✅ Database connected');
    app.listen(port, () => {
      console.log(`Radium Learning server listening on port ${port}`);
    });
  }
});
