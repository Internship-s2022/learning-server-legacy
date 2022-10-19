import express from 'express';

import globalValidations from 'src/middlewares/validations';

import courseUserControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get(
  '/by-course/:id',
  globalValidations.validateMongoID,
  courseUserControllers.getByCourseId,
);
router.get('/by-user/:id', globalValidations.validateMongoID, courseUserControllers.getByUserId);
router.post('/', validations.courseUserValidations('post'), courseUserControllers.create);
router.put(
  '/:id',
  validations.courseUserValidations('put'),
  globalValidations.validateMongoID,
  courseUserControllers.updateByUserId,
);
router.patch('/:id', globalValidations.validateMongoID, courseUserControllers.deleteByUserId);
router.get(
  '/export-by-course/csv/:id',
  globalValidations.validateMongoID,
  courseUserControllers.exportToCsvByCourseId,
);
router.get(
  '/export-by-user/csv/:id',
  globalValidations.validateMongoID,
  courseUserControllers.exportToCsvByUserId,
);

export default router;
