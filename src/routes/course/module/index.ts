import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import moduleControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get('/', getAccessRoleAndPermission, moduleControllers.getAll);
router.get(
  '/:moduleId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  moduleControllers.getById,
);
router.post(
  '/',
  getAccessRoleAndPermission,
  validations.moduleValidation,
  moduleControllers.create,
);
router.put(
  '/:moduleId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.moduleValidation,
  moduleControllers.updateById,
);
router.patch(
  '/:moduleId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  moduleControllers.deleteById,
);
router.delete(
  '/:moduleId',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  moduleControllers.physicalDeleteById,
);

export default router;
