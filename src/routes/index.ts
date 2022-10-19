import express from 'express';

import admissionTestRouter from './admission-test';
import courseRouter from './course';
import courseUserRouter from './courseUser';
import registrationFormRouter from './registration-form';
import superAdminRouter from './super-admin';
import userRouter from './user';

const router = express.Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/super-admin', superAdminRouter);
router.use('/registration-form', registrationFormRouter);
router.use('/admission-test', admissionTestRouter);
router.use('/course-user', courseUserRouter);

export default router;
