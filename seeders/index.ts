import 'dotenv/config';
import firebaseAdmin from 'firebase-admin';
import mongoose from 'mongoose';

import { FirebaseUser } from '../src/interfaces/firebase';
import AdmissionTest, { AdmissionTestType } from '../src/models/admission-test';
import Course, { CourseType } from '../src/models/course';
import CourseUser, { CourseUserType } from '../src/models/course-user';
import Group, { GroupType } from '../src/models/group';
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
import seedDatabase from './seed';
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
  groups: GroupType[];
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
  groups,
}: data = allData[env];

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
  console.log('\n\x1b[36m', padMessage('🚀 Database connected'));
  // -------------- DATABASE CONNECTION -------------- [end]

  seedDatabase();
})();
