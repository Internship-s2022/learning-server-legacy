import express from 'express';

import controllers from './controllers';
import validations from './validations';

const router = express.Router();

router.patch(
  '/me/update-password',
  validations.updatePasswordValidation,
  controllers.updatePassword,
);

export default router;
