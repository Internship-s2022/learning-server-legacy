import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import questionControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get('/', getAccessRoleAndPermission, questionControllers.getAll);
router.get(
  '/:questionId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  questionControllers.getById,
);
router.post(
  '/',
  getAccessRoleAndPermission,
  validations.courseInscriptionDate,
  validations.questionValidation('array'),
  questionControllers.create,
);
router.put(
  '/view/:viewId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.courseInscriptionDate,
  validations.questionValidation('array'),
  questionControllers.updateListOfQuestions,
);
router.put(
  '/:questionId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.courseInscriptionDate,
  validations.questionValidation('object'),
  questionControllers.updateById,
);
router.delete(
  '/:questionId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.courseInscriptionDate,
  questionControllers.physicalDeleteById,
);

export default router;
