import express from 'express';

import questionControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });

router.get('/', questionControllers.getAll);
router.get('/:questionId', questionControllers.getById);
router.post(
  '/',
  validations.courseInscriptionDate,
  validations.questionValidation('array'),
  questionControllers.create,
);
router.put(
  '/:questionId',
  validations.courseInscriptionDate,
  validations.questionValidation('object'),
  questionControllers.updateById,
);
router.delete(
  '/:questionId',
  validations.courseInscriptionDate,
  questionControllers.physicalDeleteById,
);

export default router;
