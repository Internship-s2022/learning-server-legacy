import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import controllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', firebaseValidations.superAdmin, controllers.getAllUsers);
router.get('/export/csv', controllers.exportToCsv);
router.get(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoID,
  controllers.getUserById,
);
router.post('/', firebaseValidations.superAdmin, validations.userValidation, controllers.create);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoID,
  validations.userValidation,
  controllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoID,
  controllers.deleteById,
);
router.post('/export/csv', controllers.exportToCsv);

export default router;
