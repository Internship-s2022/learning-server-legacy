import express from 'express';

import controllers from './controllers';

const router = express.Router();

router.get('/', controllers.getAllSuperadmins);
// router.get('/:id', controllers.getSuperAdminById);
router.post('/', controllers.createSuperadmin);
// router.patch('/:id', controllers.editUser);
// router.put('/:id', controllers.deleteUser);
export default router;
