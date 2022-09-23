import 'express-async-errors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app';

dotenv.config();

const port = process.env.PORT;
const MONGODB_URL = process.env.MONGO_URL || '';

mongoose.connect(MONGODB_URL, (error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.log('🔴 Database error: ', error);
  } else {
    // eslint-disable-next-line no-console
    console.log('✅ Database connected');
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Example app listening on port ${port}`);
    });
  }
});
