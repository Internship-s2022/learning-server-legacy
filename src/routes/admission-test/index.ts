import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import admissionTestControllers from './controllers';
import validations from './validations';

const router = express.Router();
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get('/', getAccessRoleAndPermission, admissionTestControllers.getAll);
router.get(
  '/:id',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  admissionTestControllers.getById,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.admissionTestValidation,
  admissionTestControllers.create,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.admissionTestValidation,
  admissionTestControllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  admissionTestControllers.deleteById,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  admissionTestControllers.physicalDeleteById,
);

export default router;
