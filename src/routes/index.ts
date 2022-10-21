import express from 'express';

import admissionTestRouter from './admission-test';
import authRouter from './auth';
import courseRouter from './course';
import courseUserRouter from './course-user';
import postulantRouter from './postulant';
import registrationFormRouter from './registration-form';
import superAdminRouter from './super-admin';
import userRouter from './user';

const router = express.Router();

router.use('/admission-test', admissionTestRouter);
router.use('/auth', authRouter);
router.use('/course', courseRouter);
router.use('/course-user', courseUserRouter);
router.use('/postulant', postulantRouter);
router.use('/registration-form', registrationFormRouter);
router.use('/super-admin', superAdminRouter);
router.use('/user', userRouter);

export default router;
