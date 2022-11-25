import express from 'express';

import firebase from 'src/middlewares/firebase';

import controllers from './controllers';
import validations from './validations';

const router = express.Router();

router.patch(
  '/me/update-password',
  firebase.normalUser,
  validations.updatePasswordValidation,
  controllers.updatePassword,
);
router.get('/me', firebase.normalUser, controllers.getMeInfo);

export default router;
