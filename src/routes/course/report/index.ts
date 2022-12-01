import express from 'express';

import globalValidations from 'src/middlewares/validations';

import reportControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });

router.get('/', globalValidations.validateMongoId, reportControllers.getByCourseId);
router.get('/module/:moduleId', globalValidations.validateMongoId, reportControllers.getByModuleId);
router.get('/group/:groupId', globalValidations.validateMongoId, reportControllers.getByGroupId);
router.get(
  '/student/:studentId',
  globalValidations.validateMongoId,
  reportControllers.getByStudentId,
);
router.patch(
  '/',
  globalValidations.validateMongoId,
  validations.reportValidation,
  reportControllers.update,
);
router.get('/export/csv', globalValidations.validateMongoId, reportControllers.exportByCourseId);
router.get(
  '/module/:moduleId/export/csv',
  globalValidations.validateMongoId,
  reportControllers.exportByModuleId,
);
router.get(
  '/group/:groupId/export/csv',
  globalValidations.validateMongoId,
  reportControllers.exportByGroupId,
);
router.get(
  '/student/:studentId/export/csv',
  globalValidations.validateMongoId,
  reportControllers.exportByStudentId,
);

export default router;
