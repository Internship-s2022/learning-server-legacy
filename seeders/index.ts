import 'dotenv/config';
import firebaseAdmin from 'firebase-admin';
import mongoose from 'mongoose';

import seedDatabase from './seed';
import { padMessage } from './utils';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
});

(async () => {
  // -------------- DATABASE CONNECTION -------------- [start]
  await mongoose.connect(`${process.env.MONGO_URL}`, {
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASS,
    dbName: process.env.DATABASE_NAME,
  });
  console.log('\n\x1b[36m', padMessage('🚀 Database connected'), '\n');
  // -------------- DATABASE CONNECTION -------------- [end]

  seedDatabase();
})();
