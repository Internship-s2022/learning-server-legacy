import 'dotenv/config';
import firebaseAdmin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { DeleteResult } from 'mongodb';
import mongoose from 'mongoose';

import { FirebaseUser } from '../src/interfaces/firebase';
import Course, { CourseType } from '../src/models/course';
import RegistrationForm, { RegistrationFormType } from '../src/models/registration-form';
import SuperAdmin, { SuperAdminType } from '../src/models/super-admin';
import config from './config';
import allData from './data';

interface data {
  courses: CourseType[];
  firebaseUsers: FirebaseUser[];
  superAdmins: SuperAdminType[];
  registrationForms: RegistrationFormType[];
}

const env = (process.env.ENV as keyof typeof allData | undefined) || 'develop';

const { courses, firebaseUsers, registrationForms, superAdmins }: data = allData[env];

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
});

(async () => {
  console.log('\x1b[33m', '                      ----------------------');
  console.log('\x1b[33m', '|-------------------- | Board configuration | --------------------|');
  console.log('\x1b[33m', '                      ----------------------');
  console.log('\x1b[33m', '    Seeding env:', `\x1b[37m${env}\n`);
  Object.entries(config).forEach((item) => {
    if (typeof item[1] === 'boolean') {
      console.log('\x1b[33m%s\x1b[1m', `     📝 ${item[0]} ${item[1]}`, '\x1b[0m');
    } else if (typeof item[1] === 'object') {
      const label = Object.entries(item[1])
        .filter((subItem) => subItem[1])
        .map((subItem) => subItem[0]);
      if (label.length) {
        console.log('\x1b[33m%s\x1b[1m', `     🛠  ${item[0]} ==> ${label}`, '\x1b[0m');
      }
    }
  });

  // -------------- DATABASE CONNECTION -------------- [start]
  await mongoose.connect(`${process.env.MONGO_URL}`, {
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASS,
    dbName: process.env.DATABASE_NAME,
  });
  console.log(
    '\n\x1b[32m',
    '|-------------------- ✅ Database connected ----------------------|\n',
  );
  // -------------- DATABASE CONNECTION -------------- [end]

  try {
    if (config.remove) {
      console.log(
        '\x1b[33m',
        '|-------------------- ⚙️  Removing previous data ------------------|',
      );
      // ------------ REMOVE FIREBASE USERS ----------- [start]
      const promises: Promise<DeleteResult>[] = [];
      // remove firebase users
      let removeFirebaseUsers: Promise<void>[] = [];
      if (config.firebaseUsers.remove) {
        const firebaseCurrentUsers = await firebaseAdmin.auth().listUsers();
        removeFirebaseUsers = firebaseCurrentUsers.users.map((user) => {
          return firebaseAdmin.auth().deleteUser(user.uid);
        });
      }
      // ------------ REMOVE FIREBASE USERS -------- [end]

      // ------------ REMOVE MONGODB COLLECTIONS -- [start]
      if (config.superAdmins.remove) {
        promises.push(SuperAdmin.collection.deleteMany({}));
        console.log(
          '\x1b[32m',
          '|-------------------- ✅ Super admins removed --------------------|',
        );
      }

      if (config.courses.remove) {
        promises.push(Course.collection.deleteMany({}));
        console.log(
          '\x1b[32m',
          '|-------------------- ✅ Courses removed -------------------------|',
        );
      }

      if (config.registrationForms.remove) {
        promises.push(RegistrationForm.collection.deleteMany({}));
        console.log(
          '\x1b[32m',
          '|-------------------- ✅ Registration Forms removed --------------|',
        );
      }
      // ------------ REMOVE MONGODB COLLECTIONS -- [end]

      await Promise.all([Promise.all(removeFirebaseUsers), Promise.all(promises)]);

      console.log();
    }

    if (config.create) {
      console.log(
        '\x1b[33m',
        '|-------------------- ⚙️  Adding new data -------------------------|',
      );
      const promises: Promise<unknown>[] = [];
      let createFirebaseUsers: Promise<UserRecord>[] = [];
      // ------------ CREATE FIREBASE USERS ----------- [start]
      if (config.firebaseUsers.create) {
        createFirebaseUsers = firebaseUsers.map((user) => {
          const userType = user.type;
          return firebaseAdmin
            .auth()
            .createUser({ ...user })
            .then(async (userRecord) => {
              await firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, { userType });
              return userRecord;
            });
        });
      }
      // ------------ CREATE FIREBASE USERS ----------- [end]

      // ------------ HELPERS ----------- [start]
      const createdUsers = await Promise.all(createFirebaseUsers);
      const superAdminWithFirebaseUid = superAdmins.map((superAdmin, id) => {
        return {
          ...superAdmin,
          firebaseUid: createdUsers[id]?.uid,
        };
      });
      // ------------ HELPERS ----------- [end]

      // ------------ UPLOAD MONGODB COLLECTIONS -- [start]
      if (config.superAdmins.create) {
        await Promise.all(superAdminWithFirebaseUid)
          .then((superAdmins) => {
            promises.push(SuperAdmin.collection.insertMany(superAdmins));
          })
          .catch((err) => {
            throw Error(err);
          });
        console.log(
          '\x1b[32m',
          '|-------------------- ✅ Super admins added ----------------------|',
        );
      }

      if (config.courses.create) {
        promises.push(Course.collection.insertMany(courses));
        console.log(
          '\x1b[32m',
          '|-------------------- ✅ Courses added ---------------------------|',
        );
      }

      if (config.registrationForms.create) {
        promises.push(RegistrationForm.collection.insertMany(registrationForms));
        console.log(
          '\x1b[32m',
          '|-------------------- ✅ Registration Forms added ----------------|',
        );
      }
      // ------------ UPLOAD MONGODB COLLECTIONS -- [end]
      await Promise.all(promises);

      console.log('\x1b[0m');
    }
    process.exit();
  } catch (err) {
    console.log('\x1b[0m', err);
    process.exit();
  }
})();
