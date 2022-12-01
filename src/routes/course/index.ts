import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';
import groupRouter from 'src/routes/course/group';
import moduleRouter from 'src/routes/course/module';
import reportRouter from 'src/routes/course/report';

import coursesControllers from './controllers';
import postulantCourseRoute from './postulant-course';
import validations from './validations';

const router = express.Router();

router.use(
  '/:courseId/report',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.courseId,
  reportRouter,
);
router.use(
  '/:courseId/module',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.courseId,
  moduleRouter,
);
router.use(
  '/:courseId/postulation',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.courseId,
  postulantCourseRoute,
);
router.use(
  '/:courseId/group',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.courseId,
  groupRouter,
);
router.get('/', firebaseValidations.superAdmin, coursesControllers.getAll);
router.get('/export/csv', firebaseValidations.superAdmin, coursesControllers.exportToCsv);
router.get(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.getById,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.courseValidation,
  coursesControllers.create,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.courseValidation,
  coursesControllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.deleteById,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.physicalDeleteById,
);

export default router;
