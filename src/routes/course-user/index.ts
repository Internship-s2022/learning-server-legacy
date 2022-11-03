import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import courseUserControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get(
  '/by-course/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  courseUserControllers.getByCourseId,
);
router.get(
  '/by-user/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  courseUserControllers.getByUserId,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.courseUserValidations('post'),
  courseUserControllers.assignRole,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  validations.courseUserValidations('put'),
  globalValidations.validateMongoId,
  courseUserControllers.updateByUserId,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  courseUserControllers.disableByUserId,
);
router.get(
  '/export-by-course/csv/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  courseUserControllers.exportToCsvByCourseId,
);
router.get(
  '/export-by-user/csv/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  courseUserControllers.exportToCsvByUserId,
);

export default router;
