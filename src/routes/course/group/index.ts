import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';

import groupControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });
const getAccessRoleAndPermission = firebaseValidations.accessBasedOnRoleAndType({
  roles: ['ADMIN'],
  types: ['SUPER_ADMIN', 'NORMAL'],
});

router.get('/', getAccessRoleAndPermission, groupControllers.getAll);
router.get(
  '/:groupId',
  firebaseValidations.accessBasedOnRoleAndType({
    roles: ['ADMIN', 'TUTOR'],
    types: ['SUPER_ADMIN', 'NORMAL'],
  }),
  globalValidations.validateMongoId,
  groupControllers.getById,
);
router.post('/', getAccessRoleAndPermission, validations.groupValidation, groupControllers.create);
router.put(
  '/:groupId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  validations.groupValidation,
  groupControllers.updateById,
);
router.patch(
  '/:groupId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  groupControllers.deleteById,
);
router.delete(
  '/:groupId',
  getAccessRoleAndPermission,
  globalValidations.validateMongoId,
  groupControllers.physicalDeleteById,
);
router.get('/export/csv', getAccessRoleAndPermission, groupControllers.exportToCsv);

export default router;
