import express from 'express';

import globalValidations from 'src/middlewares/validations';

import controllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', controllers.getCourses);
router.get('/:courseId', globalValidations.validateMongoId, controllers.getCourseById);
router.get(
  '/:courseId/registration-form',
  globalValidations.validateMongoId,
  controllers.getRegistrationFormByView,
);
router.post('/:courseId/postulation', validations.validateCreation, controllers.createPostulation);

export default router;
