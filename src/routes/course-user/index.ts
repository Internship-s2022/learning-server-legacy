import express from 'express';

import globalValidations from 'src/middlewares/validations';

import courseUserControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get(
  '/by-course/:id',
  globalValidations.validateMongoId,
  courseUserControllers.getByCourseId,
);
router.get('/by-user/:id', globalValidations.validateMongoId, courseUserControllers.getByUserId);
router.post('/', validations.courseUserValidations('post'), courseUserControllers.assignRole);
router.put(
  '/:id',
  validations.courseUserValidations('put'),
  globalValidations.validateMongoId,
  courseUserControllers.updateByUserId,
);
router.patch('/:id', globalValidations.validateMongoId, courseUserControllers.disableByUserId);
router.get(
  '/export-by-course/csv/:id',
  globalValidations.validateMongoId,
  courseUserControllers.exportToCsvByCourseId,
);
router.get(
  '/export-by-user/csv/:id',
  globalValidations.validateMongoId,
  courseUserControllers.exportToCsvByUserId,
);

export default router;
