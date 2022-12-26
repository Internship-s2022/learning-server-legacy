import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import postulantCourseControllers from './controllers';
import postulantCourseValidations from './validations';

const router = express.Router({ mergeParams: true });
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get('/', getAccessRoleAndPermission, postulantCourseControllers.getByCourseId);
router.post(
  '/admission-test',
  getAccessRoleAndPermission,
  postulantCourseValidations.validateCorrection,
  postulantCourseControllers.correctTests,
);
router.post(
  '/promote',
  getAccessRoleAndPermission,
  postulantCourseValidations.validatePromotion,
  postulantCourseControllers.promoteMany,
);
router.delete(
  '/:postulantId',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  postulantCourseControllers.physicalDeleteByCourseId,
);
router.get(
  '/export/csv',
  getAccessRoleAndPermission,
  postulantCourseControllers.exportToCsvByCourseId,
);

export default router;
