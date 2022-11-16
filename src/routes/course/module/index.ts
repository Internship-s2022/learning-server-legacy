import express from 'express';

import globalValidations from 'src/middlewares/validations';

import moduleControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });

router.get('/', moduleControllers.getAll);
router.get('/:moduleId', globalValidations.validateMongoId, moduleControllers.getById);
router.post('/', validations.moduleValidation, moduleControllers.create);
router.put(
  '/:moduleId',
  globalValidations.validateMongoId,
  validations.moduleValidation,
  moduleControllers.updateById,
);
router.patch('/:moduleId', globalValidations.validateMongoId, moduleControllers.deleteById);
router.delete(
  '/:moduleId',
  globalValidations.validateMongoId,
  moduleControllers.physicalDeleteById,
);

export default router;
