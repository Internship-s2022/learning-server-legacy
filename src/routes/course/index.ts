import express from 'express';

import globalValidations from 'src/middlewares/validations';

import coursesControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', coursesControllers.getAll);
router.get('/export/csv', coursesControllers.exportToCsv);
router.get('/:id', globalValidations.validateMongoId, coursesControllers.getById);
router.post('/', validations.courseValidation, coursesControllers.create);
router.put(
  '/:id',
  globalValidations.validateMongoId,
  validations.courseValidation,
  coursesControllers.update,
);
router.patch('/:id', globalValidations.validateMongoId, coursesControllers.deleteById);

export default router;
