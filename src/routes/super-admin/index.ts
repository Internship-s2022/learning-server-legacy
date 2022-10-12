import express from 'express';

import globalValidations from '../../middlewares/validations';
import superAdminControllers from './controllers';
import validations from './validation';

const router = express.Router();

router.get('/', superAdminControllers.getAll);
router.get('/:id', globalValidations.validateMongoID, superAdminControllers.getById);
router.post('/', validations.superAdminValidation, superAdminControllers.create);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.superAdminValidation,
  superAdminControllers.update,
);
router.patch('/:id', globalValidations.validateMongoID, superAdminControllers.deleteById);

export default router;
