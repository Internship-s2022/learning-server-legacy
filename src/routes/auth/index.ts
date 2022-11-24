import express from 'express';

import globalValidations from 'src/middlewares/validations';

import controllers from './controllers';
import validations from './validations';

const router = express.Router();

router.patch(
  '/me/update-password',
  validations.updatePasswordValidation,
  controllers.updatePassword,
);
router.get('/me/:uid', globalValidations.validateFirebaseUid, controllers.getMeInfo);

export default router;
