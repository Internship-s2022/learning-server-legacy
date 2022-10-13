import express from 'express';

import firebaseValidations from '../../middlewares/firebase';
import globalValidations from '../../middlewares/validations';
import superAdminControllers from './controllers';
import validations from './validation';

const router = express.Router();

router.get('/', superAdminControllers.getAll);
router.get('/:id', globalValidations.validateMongoID, superAdminControllers.getById);
router.post('/', validations.superAdminValidation, superAdminControllers.create);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoID,
  validations.superAdminValidation,
  superAdminControllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoID,
  superAdminControllers.deleteById,
);

export default router;
