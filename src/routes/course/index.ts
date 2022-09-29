import express from 'express';

import globalValidations from '../../middlewares/validations';
import controllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', controllers.getAllCourses);
router.get('/:id', globalValidations.validateMongoID, controllers.getCourseById);
router.post('/', validations.courseValidation, controllers.createCourse);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.courseValidation,
  controllers.updateCourse,
);
router.patch('/:id', globalValidations.validateMongoID, controllers.deleteCourse);

export default router;
