import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import postulantsControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', firebaseValidations.superAdmin, postulantsControllers.getAll);
router.get('/:dni', firebaseValidations.superAdmin, postulantsControllers.getByDni);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.postulantValidation,
  postulantsControllers.create,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.postulantValidation,
  postulantsControllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  postulantsControllers.deleteById,
);
router.get('/export/csv', firebaseValidations.superAdmin, postulantsControllers.exportToCsv);

export default router;
