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
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.use(
  '/:courseId/report',
  globalValidations.validateMongoId,
  validations.courseId,
  reportRouter,
);
router.use(
  '/:courseId/module',
  globalValidations.validateMongoId,
  validations.courseId,
  moduleRouter,
);
router.use(
  '/:courseId/postulation',
  globalValidations.validateMongoId,
  validations.courseId,
  postulantCourseRoute,
);
router.use(
  '/:courseId/group',
  globalValidations.validateMongoId,
  validations.courseId,
  groupRouter,
);
router.get('/', firebaseValidations.superAdmin, coursesControllers.getAll);
router.get('/export/csv', firebaseValidations.superAdmin, coursesControllers.exportToCsv);
router.get(
  '/:courseId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  coursesControllers.getById,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.courseValidation('post'),
  coursesControllers.create,
);
router.put(
  '/:courseId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.courseValidation('put'),
  coursesControllers.update,
);
router.patch(
  '/:courseId',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.deleteById,
);
router.delete(
  '/:courseId',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.physicalDeleteById,
);

export default router;
