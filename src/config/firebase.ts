import admin from 'firebase-admin';

let firebaseApp = admin.initializeApp();

!process.env.IS_TEST
  ? (firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
    }))
  : undefined;

export default firebaseApp;
