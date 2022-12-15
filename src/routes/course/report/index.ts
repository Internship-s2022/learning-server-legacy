import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import reportControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });
const getAdminAccess = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

const getTutorAccess = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN', 'TUTOR'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get('/', getAdminAccess, globalValidations.validateMongoId, reportControllers.getByCourseId);
router.get(
  '/module/:moduleId',
  getAdminAccess,
  globalValidations.validateMongoId,
  reportControllers.getByModuleId,
);
router.get(
  '/group/:groupId',
  getTutorAccess,
  globalValidations.validateMongoId,
  reportControllers.getByGroupId,
);
router.get(
  '/student/:studentId',
  getTutorAccess,
  globalValidations.validateMongoId,
  reportControllers.getByStudentId,
);
router.patch(
  '/',
  getTutorAccess,
  globalValidations.validateMongoId,
  validations.reportValidation,
  reportControllers.update,
);
router.get(
  '/export/csv',
  getAdminAccess,
  globalValidations.validateMongoId,
  reportControllers.exportByCourseId,
);
router.get(
  '/module/:moduleId/export/csv',
  getAdminAccess,
  globalValidations.validateMongoId,
  reportControllers.exportByModuleId,
);
router.get(
  '/group/:groupId/export/csv',
  getTutorAccess,
  globalValidations.validateMongoId,
  reportControllers.exportByGroupId,
);
router.get(
  '/student/:studentId/export/csv',
  getTutorAccess,
  globalValidations.validateMongoId,
  reportControllers.exportByStudentId,
);

export default router;
