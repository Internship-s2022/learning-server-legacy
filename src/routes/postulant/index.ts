import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import postulantsControllers from './controllers';
import validations from './validations';

const router = express.Router();
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get('/', getAccessRoleAndPermission, postulantsControllers.getAll);
router.get(
  '/:dni',
  globalValidations.validateDni,
  getAccessRoleAndPermission,
  postulantsControllers.getByDni,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.postulantValidation(),
  postulantsControllers.create,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.postulantValidation(),
  postulantsControllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  postulantsControllers.deleteById,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  postulantsControllers.physicalDeleteById,
);
router.get('/export/csv', firebaseValidations.superAdmin, postulantsControllers.exportToCsv);

export default router;
