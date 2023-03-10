import 'dotenv/config';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { DeleteResult, InsertManyResult } from 'mongodb';

import { FirebaseUser } from '../src/interfaces/firebase';
import { AdmissionResultType } from '../src/models/admission-result';
import { AdmissionTestType } from '../src/models/admission-test';
import { CourseType } from '../src/models/course';
import { CourseUserType } from '../src/models/course-user';
import { GroupType } from '../src/models/group';
import { ModuleType } from '../src/models/module';
import { PostulantType } from '../src/models/postulant';
import { PostulantCourseType } from '../src/models/postulant-course';
import { QuestionType } from '../src/models/question';
import { RegistrationFormType } from '../src/models/registration-form';
import { ReportType } from '../src/models/report';
import SuperAdmin, { SuperAdminType } from '../src/models/super-admin';
import { UserType } from '../src/models/user';
import config from './config';
import allData from './data';
import { generateRandomCourseUsers } from './random-data/course-users';
import { generateRandomGroups } from './random-data/groups';
import { generateRandomModules } from './random-data/modules';
import { generateRandomPostulantCourses } from './random-data/postulant-course';
import { generateRandomPostulants } from './random-data/postulants';
import { generateRegistrationFormPerCourse } from './random-data/registration-form';
import { generateRandomReports } from './random-data/reports';
import { generateRandomUsers } from './random-data/users';
import {
  addCollection,
  listAndAddAllUsers,
  listAndRemoveAllUsers,
  padMessage,
  removeCollection,
} from './utils';

interface Data {
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
  groups: GroupType[];
  reports: ReportType[];
  postulantCourses: PostulantCourseType[];
  admissionResults: AdmissionResultType[];
}

const env = (process.env.DATABASE_NAME as keyof typeof allData | undefined) || 'develop';

const { courses, firebaseUsers, superAdmins, postulants, users, ...restData }: Data = allData[env];

const seedDatabase = async (endProcess = true) => {
  console.log('\x1b[36m', padMessage('-----------------------', ' '));
  console.log('\x1b[36m', padMessage('| Board configuration |'));
  console.log('\x1b[36m', padMessage('-----------------------', ' '));
  console.log('\x1b[36m'.padStart(10), 'Seeding env:', `\x1b[37m${env}\n`);
  Object.entries(config).forEach((item) => {
    if (typeof item[1] === 'boolean') {
      console.log(
        '\x1b[36m%s\x1b[1m'.padStart(15),
        `- ${item[0]}`.padEnd(20) + `\x1b[37m ${item[1] ? '???' : '????'}`,
        '\x1b[0m',
      );
    } else if (typeof item[1] === 'object') {
      const label = Object.entries(item[1])
        .filter((subItem) => typeof subItem[1] === 'boolean' || typeof subItem[1] === 'number')
        .map((subItem) =>
          typeof subItem[1] === 'number'
            ? ` ${subItem[0]}: \x1b[33m${subItem[1]} `
            : ` ${subItem[0]}: \x1b[33m${subItem[1] ? '???' : '????'}\x1b[0m`,
        );
      if (label.length) {
        console.log(
          '\x1b[36m%s\x1b[1m'.padStart(15),
          `- ${item[0]}`.padEnd(20) + `\x1b[37m${label}`,
          '\x1b[0m',
        );
      }
    }
  });

  const { postulants: randomPostulants } = generateRandomPostulants(config.postulants.amountRandom);
  const allPostulants = [...randomPostulants, ...postulants];
  const { firebaseUsers: randomFirebaseUsers, users: randomUsers } = generateRandomUsers(
    config.users.amountRandom,
    allPostulants,
  );
  let allFirebaseUsers = [...firebaseUsers, ...randomFirebaseUsers];
  if (config.firebaseUsers.onlySA) {
    allFirebaseUsers = [firebaseUsers[0]];
  }
  const allUsers = [...users, ...randomUsers];
  const { registrationForms, questions } = generateRegistrationFormPerCourse(courses);
  const { courseUsers: randomCourseUsers } = generateRandomCourseUsers(courses, allUsers);
  const { postulantCourses, admissionResults } = generateRandomPostulantCourses(
    courses,
    allPostulants,
    registrationForms,
    allUsers,
    questions,
    randomCourseUsers,
  );
  const { modules: randomModules } = generateRandomModules(config.modules.amountRandom, courses);
  const allModules = randomModules;
  const allCourseUsers = randomCourseUsers;
  const { reports: randomReports } = generateRandomReports(courses, allModules, allCourseUsers);
  const { groups: randomGroups } = generateRandomGroups(courses, allModules, allCourseUsers);
  const allGroups = randomGroups;

  const data: Omit<Data, 'firebaseUsers'> = {
    ...restData,
    courses,
    superAdmins,
    postulants: allPostulants,
    users: allUsers,
    courseUsers: allCourseUsers,
    modules: allModules,
    groups: allGroups,
    registrationForms,
    questions,
    postulantCourses,
    reports: randomReports,
    admissionResults,
  };

  try {
    if (config.remove) {
      console.log();

      console.log('\x1b[36m', padMessage('?????? Removing previous data'));
      // ------------ REMOVE FIREBASE USERS ----------- [start]
      const promises: Promise<DeleteResult>[] = [];
      const removeFirebaseUsers: Promise<void>[] = [];
      if (config.firebaseUsers.remove) {
        removeFirebaseUsers.push(listAndRemoveAllUsers());
      }
      // ------------ REMOVE FIREBASE USERS -------- [end]

      // ------------ REMOVE MONGODB COLLECTIONS -- [start]
      Object.values(config).forEach((resource) => {
        if (typeof resource === 'object' && 'collection' in resource) {
          removeCollection(promises, resource);
        }
      });
      // ------------ REMOVE MONGODB COLLECTIONS -- [end]

      await Promise.all([Promise.all(removeFirebaseUsers), Promise.all(promises)]);

      console.log();
    }

    if (config.create) {
      const promises: Promise<InsertManyResult>[] = [];
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

      console.log('\n\x1b[36m', padMessage('?????? Adding new data on Mongo'));

      // ------------ UPLOAD MONGODB COLLECTIONS -- [start]
      if (config.superAdmins.create) {
        await Promise.all(superAdminWithFirebaseUid)
          .then((superAdmins) => {
            promises.push(SuperAdmin.collection.insertMany(superAdmins));
          })
          .catch((err) => {
            throw Error(err);
          });
        console.log('\x1b[37m', padMessage('???? Super admins added'));
      }

      Object.entries(config).forEach(([key, resource]) => {
        if (
          typeof resource === 'object' &&
          resource.create &&
          'collection' in resource &&
          key !== 'superAdmins'
        ) {
          addCollection(promises, resource, data[key as keyof Omit<Data, 'firebaseUsers'>]);
        }
      });

      // ------------ UPLOAD MONGODB COLLECTIONS -- [end]

      await Promise.all(promises);

      console.log('\x1b[0m');
    }
    if (endProcess) process.exit();
  } catch (err) {
    console.log('\x1b[0m ????', err);
    if (endProcess) process.exit();
  }
};

export default seedDatabase;
