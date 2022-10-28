import express from 'express';

import globalValidations from 'src/middlewares/validations';

import admissionTestControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', admissionTestControllers.getAll);
router.get('/:id', globalValidations.validateMongoId, admissionTestControllers.getById);
router.post('/', validations.admissionTestValidation, admissionTestControllers.create);
router.put(
  '/:id',
  globalValidations.validateMongoId,
  validations.admissionTestValidation,
  admissionTestControllers.update,
);
router.patch('/:id', globalValidations.validateMongoId, admissionTestControllers.deleteById);

export default router;
