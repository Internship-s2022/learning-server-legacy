import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';
import questionRouter from 'src/routes/registration-form/question';

import registrationFormControllers from './controllers';
import validations from './validations';
const router = express.Router();

router.use('/:regFormId/question', firebaseValidations.superAdmin, questionRouter);
router.get('/', firebaseValidations.superAdmin, registrationFormControllers.getAll);
router.get(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  registrationFormControllers.getById,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.registrationFormValidation('post'),
  registrationFormControllers.create,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.registrationFormValidation('put'),
  registrationFormControllers.updateById,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  registrationFormControllers.deleteById,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  registrationFormControllers.physicalDeleteById,
);

export default router;
