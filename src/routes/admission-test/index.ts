import express from 'express';

import globalValidations from '../../middlewares/validations';
import admissionTestControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', admissionTestControllers.getAll);
router.get('/:id', globalValidations.validateMongoID, admissionTestControllers.getById);
router.post('/', validations.admissionTest, admissionTestControllers.create);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.admissionTest,
  admissionTestControllers.update,
);
router.patch('/:id', globalValidations.validateMongoID, admissionTestControllers.deleteById);

export default router;
