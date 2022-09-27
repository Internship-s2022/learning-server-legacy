import express from 'express';

import controllers from './controllers';

const router = express.Router();

router.get('/', controllers.getAllSuperAdmins);
router.post('/', controllers.createSuperadmin);
router.patch('/:id', controllers.updateSuperadmin);
router.delete('/:id', controllers.deleteSuperadminById);
export default router;
