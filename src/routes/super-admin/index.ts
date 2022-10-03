import express from 'express';

import globalValidations from '../../middlewares/validations';
import controllers from './controllers';
import validations from './validation';

const router = express.Router();

router.get('/', controllers.getAllSuperAdmins);
router.get('/:id', globalValidations.validateMongoID, controllers.getSuperadminById);
router.post('/', validations.superAdminValidation, controllers.createSuperAdmin);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.superAdminValidation,
  controllers.updateSuperAdmin,
);
router.patch('/:id', globalValidations.validateMongoID, controllers.deleteSuperAdmin);

export default router;
