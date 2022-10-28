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
  globalValidations.validateMongoId,
  controllers.getUserById,
);
router.post(
  '/manual',
  firebaseValidations.superAdmin,
  validations.userManualValidation,
  controllers.createManual,
);
router.post('/', firebaseValidations.superAdmin, validations.userValidation, controllers.create);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.userValidation,
  controllers.update,
);
router.patch('/update/:uid', globalValidations.validateFirebaseUid, controllers.updateIsNewUser);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  controllers.deleteById,
);

export default router;
