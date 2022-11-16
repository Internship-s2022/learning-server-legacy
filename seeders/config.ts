export default {
  remove: true,
  create: true,
  // -- FIREBASE --
  firebaseUsers: {
    remove: true,
    create: true,
  },
  // -- MONGO --
  superAdmins: {
    remove: true,
    create: true,
  },
  courses: {
    remove: true,
    create: true,
  },
  registrationForms: {
    remove: true,
    create: true,
  },
  admissionTests: {
    remove: true,
    create: true,
  },
  postulants: {
    remove: true,
    create: true,
    amountRandom: parseInt(process.env.RANDOM_USERS_AMOUNT || '20'),
  },
  users: {
    remove: true,
    create: true,
    amountRandom: parseInt(process.env.RANDOM_USERS_AMOUNT || '50'),
  },
  courseUsers: {
    remove: true,
    create: true,
  },
  questions: {
    remove: true,
    create: true,
  },
  modules: {
    remove: true,
    create: true,
  },
};
