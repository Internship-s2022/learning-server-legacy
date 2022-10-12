export default {
  remove: process.env.SEEDER_REMOVE === 'true',
  create: process.env.SEEDER_CREATE === 'true',
  // -- FIREBASE --
  firebaseUsers: {
    remove: process.env.SEEDER_FIREBASE_USERS__REMOVE === 'true',
    create: process.env.SEEDER_FIREBASE_USERS__CREATE === 'true',
  },
  // -- MONGO --
  superAdmins: {
    remove: process.env.SEEDER_SUPER_ADMINS__REMOVE === 'true',
    create: process.env.SEEDER_SUPER_ADMINS__CREATE === 'true',
  },
  courses: {
    remove: process.env.SEEDER_COURSES__REMOVE === 'true',
    create: process.env.SEEDER_COURSES__CREATE === 'true',
  },
};
