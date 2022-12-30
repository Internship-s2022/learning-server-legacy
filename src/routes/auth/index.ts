import express from 'express';

import firebase from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import controllers from './controllers';
import courseRouter from './course';
import validations from './validations';

const router = express.Router();

router.use(
  '/me/course/:courseId',
  firebase.normalUser,
  globalValidations.validateMongoId,
  firebase.studentUser,
  courseRouter,
);
router.patch(
  '/me/update-password',
  firebase.normalUser,
  validations.updatePasswordValidation,
  controllers.updatePassword,
);
router.get('/me', firebase.normalUser, controllers.getMeInfo);

export default router;
