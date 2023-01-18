import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import courseUserControllers from './controllers';
import validations from './validations';

const router = express.Router();
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get(
  '/by-course/:courseId',
  getAccessRoleAndPermission,
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
  getAccessRoleAndPermission,
  validations.courseUserValidations('post'),
  courseUserControllers.assignRole,
);
router.put(
  '/:id',
  getAccessRoleAndPermission,
  validations.courseUserValidations('put'),
  globalValidations.validateMongoId,
  courseUserControllers.updateByUserId,
);
router.patch(
  '/',
  getAccessRoleAndPermission,
  validations.courseUserDelete,
  courseUserControllers.disableByUserId,
);
router.delete(
  '/',
  firebaseValidations.superAdmin,
  validations.courseUserDelete,
  courseUserControllers.physicalDeleteByUserId,
);
router.get(
  '/export-by-course/csv/:courseId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  courseUserControllers.exportToCsvByCourseId,
);
router.get(
  '/export-by-user/csv/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  courseUserControllers.exportToCsvByUserId,
);
router.get(
  '/:courseId/without-group',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.courseUserByModuleIds,
  courseUserControllers.getWithoutGroup,
);

export default router;
