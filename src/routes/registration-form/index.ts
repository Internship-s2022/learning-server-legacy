import express from 'express';

import globalValidations from 'src/middlewares/validations';

import registrationFormControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', registrationFormControllers.getAll);
router.get('/:id', globalValidations.validateMongoID, registrationFormControllers.getById);
router.post(
  '/',
  validations.registrationFormValidation('post'),
  registrationFormControllers.create,
);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.registrationFormValidation('put'),
  registrationFormControllers.updateById,
);
router.patch('/:id', globalValidations.validateMongoID, registrationFormControllers.deleteById);

export default router;
