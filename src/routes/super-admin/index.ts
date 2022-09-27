import express from 'express';

import controllers from './controllers';
import validations from './validation';

const router = express.Router();

router.get('/', controllers.getAllSuperAdmins);
router.post('/', validations.validateCreation, controllers.createSuperadmin);
router.patch('/:id', validations.validateUpdate, controllers.updateSuperadmin);
router.delete('/:id', controllers.deleteSuperadminById);
export default router;
