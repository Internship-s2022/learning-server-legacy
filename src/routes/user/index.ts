import express from 'express';

import globalValidations from 'src/middlewares/validations';

import controllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', controllers.getAllUsers);
router.get('/export/csv', controllers.exportToCsv);
router.get('/:id', globalValidations.validateMongoID, controllers.getUserById);
router.post('/', validations.userValidation, controllers.create);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.userValidation,
  controllers.update,
);
router.patch('/:id', globalValidations.validateMongoID, controllers.deleteById);

export default router;
