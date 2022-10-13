import express from 'express';

import courseRouter from './course';
import registrationFormRouter from './registration-form';
import superAdminRouter from './super-admin';
import userRouter from './user';
const router = express.Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/super-admin', superAdminRouter);
router.use('/registration-form', registrationFormRouter);

export default router;
