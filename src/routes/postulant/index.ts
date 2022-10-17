import express from 'express';

import globalValidations from 'src/middlewares/validations';

import postulantsControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.get('/', postulantsControllers.getAll);
router.get('/:dni', postulantsControllers.getByDni);
// router.post('/', validations.postulantValidation, postulantsControllers.create);
router.put(
  '/:id',
  globalValidations.validateMongoID,
  validations.postulantValidation,
  postulantsControllers.update,
);
router.patch('/:id', globalValidations.validateMongoID, postulantsControllers.deleteById);
router.post('/csv/export', postulantsControllers.exportCSV);

export default router;
