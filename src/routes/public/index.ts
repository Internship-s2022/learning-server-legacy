import express from 'express';

import globalValidations from 'src/middlewares/validations';

import controllers from './controllers';

const router = express.Router();

router.get('/', controllers.getCourses);
router.get('/:courseId', globalValidations.validateMongoId, controllers.getCourseById);
router.get(
  '/:courseId/registration-form',
  globalValidations.validateMongoId,
  controllers.getRegistrationFormByView,
);

export default router;
