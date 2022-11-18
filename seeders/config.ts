export default {
  remove: true,
  create: true,
  // -- FIREBASE --
  firebaseUsers: {
    remove: false,
    create: false,
  },
  // -- MONGO --
  superAdmins: {
    remove: false,
    create: false,
  },
  courses: {
    remove: false,
    create: false,
  },
  registrationForms: {
    remove: false,
    create: false,
  },
  admissionTests: {
    remove: false,
    create: false,
  },
  postulants: {
    remove: true,
    create: true,
    amountRandom: parseInt(process.env.RANDOM_USERS_AMOUNT || '100'),
  },
  users: {
    remove: true,
    create: true,
    amountRandom: parseInt(process.env.RANDOM_USERS_AMOUNT || '24'),
  },
  courseUsers: {
    remove: false,
    create: false,
  },
  questions: {
    remove: false,
    create: false,
  },
  postulantCourses: {
    remove: true,
    create: true,
  },
  admissionResults: {
    remove: true,
    create: true,
  },
  modules: {
    remove: true,
    create: true,
  },
};
