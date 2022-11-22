import 'dotenv/config';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { DeleteResult } from 'mongodb';

import { FirebaseUser } from '../src/interfaces/firebase';
import AdmissionTest, { AdmissionTestType } from '../src/models/admission-test';
import Course, { CourseType } from '../src/models/course';
import CourseUser, { CourseUserType } from '../src/models/course-user';
import Module, { ModuleType } from '../src/models/module';
import Postulant, { PostulantType } from '../src/models/postulant';
import Question, { QuestionType } from '../src/models/question';
import RegistrationForm, { RegistrationFormType } from '../src/models/registration-form';
import SuperAdmin, { SuperAdminType } from '../src/models/super-admin';
import User, { UserType } from '../src/models/user';
import config from './config';
import allData from './data';
import { generateRandomCourseUsers } from './random-data/course-users';
import { generateRandomPostulants } from './random-data/postulants';
import { generateRandomUsers } from './random-data/users';
import { listAndAddAllUsers, listAndRemoveAllUsers, padMessage } from './utils';

interface data {
  admissionTests: AdmissionTestType[];
  courses: CourseType[];
  firebaseUsers: FirebaseUser[];
  superAdmins: SuperAdminType[];
  registrationForms: RegistrationFormType[];
  postulants: PostulantType[];
  users: UserType[];
  courseUsers: CourseUserType[];
  questions: QuestionType[];
  modules: ModuleType[];
}

const env = (process.env.DATABASE_NAME as keyof typeof allData | undefined) || 'develop';

const {
  admissionTests,
  courses,
  firebaseUsers,
  registrationForms,
  superAdmins,
  postulants,
  users,
  courseUsers,
  questions,
  modules,
}: data = allData[env];

const seedDatabase = async (endProcess = true) => {
  console.log('\x1b[36m', '                      ----------------------');
  console.log('\x1b[36m', padMessage('| Board configuration |'));
  console.log('\x1b[36m', '                      ----------------------');
  console.log('\x1b[36m'.padStart(10), 'Seeding env:', `\x1b[37m${env}\n`);
  Object.entries(config).forEach((item) => {
    if (typeof item[1] === 'boolean') {
      console.log(
        '\x1b[36m%s\x1b[1m'.padStart(15),
        `- ${item[0]}`.padEnd(25) + `\x1b[37m ${item[1]}`,
        '\x1b[0m',
      );
    } else if (typeof item[1] === 'object') {
      const label = Object.entries(item[1])
        .filter((subItem) => subItem[1])
        .map((subItem) =>
          typeof subItem[1] === 'number'
            ? ` ${subItem[0]}: \x1b[33m${subItem[1]} `
            : ` ${subItem[0]}`,
        );
      if (label.length) {
        console.log(
          '\x1b[36m%s\x1b[1m'.padStart(15),
          `- ${item[0]}`.padEnd(25) + `\x1b[37m${label}`,
          '\x1b[0m',
        );
      }
    }
  });

  const { postulants: randomPostulants } = generateRandomPostulants(config.postulants.amountRandom);
  const allPostulants = [...postulants, ...randomPostulants];
  const { firebaseUsers: randomFirebaseUsers, users: randomUsers } = generateRandomUsers(
    config.users.amountRandom,
    allPostulants,
  );
  const allFirebaseUsers = [...firebaseUsers, ...randomFirebaseUsers];
  const allUsers = [...users, ...randomUsers];
  const { courseUsers: randomCourseUsers } = generateRandomCourseUsers(courses, allUsers);
  const allCourseUsers = [...courseUsers, ...randomCourseUsers];

  try {
    if (config.remove) {
      console.log('\x1b[36m', padMessage('⚡️ Removing previous data'));
      // ------------ REMOVE FIREBASE USERS ----------- [start]
      const promises: Promise<DeleteResult>[] = [];
      const removeFirebaseUsers: Promise<void>[] = [];
      if (config.firebaseUsers.remove) {
        removeFirebaseUsers.push(listAndRemoveAllUsers());
      }
      // ------------ REMOVE FIREBASE USERS -------- [end]

      // ------------ REMOVE MONGODB COLLECTIONS -- [start]
      if (config.superAdmins.remove) {
        promises.push(SuperAdmin.collection.deleteMany({}));
        console.log('\n\x1b[37m', padMessage('🚀 Super admins removed'));
      }

      if (config.courses.remove) {
        promises.push(Course.collection.deleteMany({}));
        console.log('\x1b[37m', padMessage('🚀 Courses removed'));
      }

      if (config.registrationForms.remove) {
        promises.push(RegistrationForm.collection.deleteMany({}));
        console.log('\x1b[37m', padMessage('🚀 Registration Forms removed'));
      }
      if (config.postulants.remove) {
        promises.push(Postulant.collection.deleteMany({}));
        console.log('\x1b[33m', padMessage('🚀 Postulants removed'));
      }

      if (config.admissionTests.remove) {
        promises.push(AdmissionTest.collection.deleteMany({}));
        console.log('\x1b[33m', padMessage('🚀 Admission Tests removed'));
      }

      if (config.users.remove) {
        promises.push(User.collection.deleteMany({}));
        console.log('\x1b[37m', padMessage('🚀 Users removed'));
      }

      if (config.courseUsers.remove) {
        promises.push(CourseUser.collection.deleteMany({}));
        console.log('\x1b[37m', padMessage('🚀 Course users removed'));
      }

      if (config.questions.remove) {
        promises.push(Question.collection.deleteMany({}));
        console.log('\x1b[37m', padMessage('🚀 Questions removed'));
      }

      if (config.modules.remove) {
        promises.push(Module.collection.deleteMany({}));
        console.log('\x1b[37m', padMessage('🚀 Modules removed'));
      }

      // ------------ REMOVE MONGODB COLLECTIONS -- [end]

      await Promise.all([Promise.all(removeFirebaseUsers), Promise.all(promises)]);

      console.log();
    }

    if (config.create) {
      const promises: Promise<unknown>[] = [];
      let createFirebaseUsers: UserRecord[] = [];
      // ------------ CREATE FIREBASE USERS ----------- [start]
      if (config.firebaseUsers.create) {
        createFirebaseUsers = await listAndAddAllUsers(allFirebaseUsers);
      }
      // ------------ CREATE FIREBASE USERS ----------- [end]

      // ------------ HELPERS ----------- [start]
      const superAdminWithFirebaseUid = superAdmins.map((superAdmin, id) => {
        return {
          ...superAdmin,
          firebaseUid: createFirebaseUsers[id]?.uid,
        };
      });
      // ------------ HELPERS ----------- [end]

      console.log('\n\x1b[36m', padMessage('⚡️ Adding new data on Mongo'));

      // ------------ UPLOAD MONGODB COLLECTIONS -- [start]
      if (config.superAdmins.create) {
        await Promise.all(superAdminWithFirebaseUid)
          .then((superAdmins) => {
            promises.push(SuperAdmin.collection.insertMany(superAdmins));
          })
          .catch((err) => {
            throw Error(err);
          });
        console.log('\x1b[37m', padMessage('🚀 Super admins added'));
      }

      if (config.courses.create) {
        promises.push(Course.collection.insertMany(courses));
        console.log('\x1b[37m', padMessage('🚀 Courses added'));
      }

      if (config.registrationForms.create) {
        promises.push(RegistrationForm.collection.insertMany(registrationForms));
        console.log('\x1b[37m', padMessage('🚀 Registration Forms added'));
      }
      if (config.postulants.create) {
        promises.push(Postulant.collection.insertMany(allPostulants));
        console.log('\x1b[37m', padMessage('🚀 Postulants added'));
      }

      if (config.admissionTests.create) {
        promises.push(AdmissionTest.collection.insertMany(admissionTests));
        console.log('\x1b[37m', padMessage('🚀 Admission Tests added'));
      }

      if (config.users.create) {
        promises.push(User.collection.insertMany(allUsers));
        console.log('\x1b[37m', padMessage('🚀 Users added'));
      }

      if (config.courseUsers.create) {
        promises.push(CourseUser.collection.insertMany(allCourseUsers));
        console.log('\x1b[37m', padMessage('🚀 Course users added'));
      }

      if (config.questions.create) {
        promises.push(Question.collection.insertMany(questions));
        console.log('\x1b[37m', padMessage('🚀 Questions added'));
      }

      if (config.modules.create) {
        promises.push(Module.collection.insertMany(modules));
        console.log('\x1b[37m', padMessage('🚀 Modules added'));
      }

      // ------------ UPLOAD MONGODB COLLECTIONS -- [end]

      await Promise.all(promises);

      console.log('\x1b[0m');
    }
    if (endProcess) process.exit();
  } catch (err) {
    console.log('\x1b[0m 🛑', err);
    if (endProcess) process.exit();
  }
};

export default seedDatabase;
