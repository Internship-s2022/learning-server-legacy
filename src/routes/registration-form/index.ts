import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';
import questionRouter from 'src/routes/registration-form/question';

import registrationFormControllers from './controllers';
import validations from './validations';

const router = express.Router();
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.use(
  '/:regFormId/question',
  globalValidations.validateMongoId,
  validations.registrationFormId,
  questionRouter,
);
router.get('/', getAccessRoleAndPermission, registrationFormControllers.getAll);
router.get(
  '/:id',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  registrationFormControllers.getById,
);
router.put(
  '/:id',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.registrationFormValidation('put'),
  registrationFormControllers.updateById,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  registrationFormControllers.physicalDeleteById,
);

export default router;
