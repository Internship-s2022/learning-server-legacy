import express from 'express';

import globalValidations from 'src/middlewares/validations';

import groupControllers from './controllers';
import validations from './validations';

const router = express.Router({ mergeParams: true });

router.get('/', groupControllers.getAll);
router.get('/:groupId', globalValidations.validateMongoId, groupControllers.getById);
router.post('/', validations.groupValidation, groupControllers.create);
router.put(
  '/:groupId',
  globalValidations.validateMongoId,
  validations.groupValidation,
  groupControllers.updateById,
);
router.patch('/:groupId', globalValidations.validateMongoId, groupControllers.deleteById);
router.delete('/:groupId', globalValidations.validateMongoId, groupControllers.physicalDeleteById);
router.get('/export/csv', groupControllers.exportToCsv);

export default router;
