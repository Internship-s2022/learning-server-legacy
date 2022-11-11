import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';

import postulantCourseControllers from './controllers';

const router = express.Router({ mergeParams: true });

router.post('/', firebaseValidations.superAdmin, postulantCourseControllers.create);

export default router;
