import express from 'express';

import globalValidations from 'src/middlewares/validations';

import questionControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });

router.get('/', questionControllers.getAll);
router.get('/:questionId', globalValidations.validateMongoId, questionControllers.getById);
router.post(
  '/',
  validations.courseInscriptionDate,
  validations.questionValidation('array'),
  questionControllers.create,
);
router.put(
  '/:questionId',
  globalValidations.validateMongoId,
  validations.courseInscriptionDate,
  validations.questionValidation('object'),
  questionControllers.updateById,
);
router.delete(
  '/:questionId',
  globalValidations.validateMongoId,
  validations.courseInscriptionDate,
  questionControllers.physicalDeleteById,
);

export default router;
