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
router.post('/', validations.courseUserValidations, courseUserControllers.create);
router.put(
  '/:id',
  validations.courseUserValidations,
  globalValidations.validateMongoID,
  courseUserControllers.updateByUserId,
);
router.patch('/:id', globalValidations.validateMongoID, courseUserControllers.deleteByUserId);

export default router;
