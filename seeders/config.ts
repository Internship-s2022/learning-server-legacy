import AdmissionResult from '../src/models/admission-result';
import AdmissionTest from '../src/models/admission-test';
import Course from '../src/models/course';
import CourseUser from '../src/models/course-user';
import Group from '../src/models/group';
import Module from '../src/models/module';
import Postulant from '../src/models/postulant';
import PostulantCourse from '../src/models/postulant-course';
import Question from '../src/models/question';
import RegistrationForm from '../src/models/registration-form';
import Report from '../src/models/report';
import SuperAdmin from '../src/models/super-admin';
import User from '../src/models/user';

export default {
  remove: true,
  create: true,
  // -- FIREBASE --
  firebaseUsers: {
    onlySA: false,
    remove: true,
    create: true,
  },
  // -- MONGO --
  superAdmins: {
    remove: true,
    create: true,
    collection: SuperAdmin.collection,
    message: 'Super admins',
  },
  courses: {
    remove: true,
    create: true,
    collection: Course.collection,
    message: 'Courses',
  },
  registrationForms: {
    remove: true,
    create: true,
    collection: RegistrationForm.collection,
    message: 'Registration Forms',
  },
  admissionTests: {
    remove: true,
    create: true,
    collection: AdmissionTest.collection,
    message: 'Admission Tests',
  },
  postulants: {
    remove: true,
    create: true,
    collection: Postulant.collection,
    message: 'Postulants',
    amountRandom: parseInt(process.env.RANDOM_POSTULANTS_AMOUNT || '100'),
  },
  users: {
    remove: true,
    create: true,
    collection: User.collection,
    message: 'Users',
    amountRandom: parseInt(process.env.RANDOM_USERS_AMOUNT || '164'),
  },
  courseUsers: {
    remove: true,
    create: true,
    collection: CourseUser.collection,
    message: 'Course users',
  },
  questions: {
    remove: true,
    create: true,
    collection: Question.collection,
    message: 'Questions',
  },
  postulantCourses: {
    remove: true,
    create: true,
    collection: PostulantCourse.collection,
    message: 'Postulant courses',
  },
  admissionResults: {
    remove: true,
    create: true,
    collection: AdmissionResult.collection,
    message: 'Admission results',
  },
  modules: {
    remove: true,
    create: true,
    collection: Module.collection,
    message: 'Modules',
    amountRandom: parseInt(process.env.RANDOM_MODULES_PER_COURSE_AMOUNT || '15'),
  },
  groups: {
    remove: true,
    create: true,
    collection: Group.collection,
    message: 'Groups',
  },
  reports: {
    remove: true,
    create: true,
    collection: Report.collection,
    message: 'Reports',
  },
};
