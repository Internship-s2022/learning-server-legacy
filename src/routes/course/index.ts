import express from 'express';

import globalValidations from '../../middlewares/validations';
import coursesControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', coursesControllers.getAll);
router.get('/:id', globalValidations.validateMongoID, coursesControllers.getById);
router.post('/', validations.courseValidation, coursesControllers.create);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.courseValidation,
  coursesControllers.update,
);
router.patch('/:id', globalValidations.validateMongoID, coursesControllers.deleteById);

export default router;
