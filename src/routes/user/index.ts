import express from 'express';

import controllers from './controllers';

const router = express.Router();

router.get('/', controllers.getAllUsers);
router.get('/:id', controllers.getUserById);
router.post('/', controllers.createUser);
router.patch('/:id', controllers.editUser);
router.put('/:id', controllers.deleteUser);

export default router;
