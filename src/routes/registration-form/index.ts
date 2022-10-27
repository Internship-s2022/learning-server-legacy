import express from 'express';

import globalValidations from 'src/middlewares/validations';

import registrationFormControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', registrationFormControllers.getAll);
router.get('/:id', globalValidations.validateMongoId, registrationFormControllers.getById);
router.post(
  '/',
  validations.registrationFormValidation('post'),
  registrationFormControllers.create,
);
router.put(
  '/:id',
  globalValidations.validateMongoId,
  validations.registrationFormValidation('put'),
  registrationFormControllers.updateById,
);
router.patch('/:id', globalValidations.validateMongoId, registrationFormControllers.deleteById);

export default router;
