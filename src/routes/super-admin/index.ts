import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import superAdminControllers from './controllers';
import validations from './validation';

const router = express.Router();

router.get('/', firebaseValidations.superAdmin, superAdminControllers.getAll);
router.get(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  superAdminControllers.getById,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.superAdminValidation,
  superAdminControllers.create,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.superAdminValidation,
  superAdminControllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  superAdminControllers.deleteById,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  superAdminControllers.physicalDeleteById,
);

export default router;
