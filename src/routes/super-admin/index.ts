import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import superAdminControllers from './controllers';
import maintenanceRouter from './maintenance';
import validations from './validation';

const router = express.Router();

router.get('/', firebaseValidations.superAdmin, superAdminControllers.getAll);
router.use('/maintenance', firebaseValidations.superAdmin, maintenanceRouter);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.superAdminValidation,
  superAdminControllers.create,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  superAdminControllers.physicalDeleteById,
);

export default router;
