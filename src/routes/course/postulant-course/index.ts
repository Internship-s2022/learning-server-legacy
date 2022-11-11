import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';

import postulantCourseControllers from './controllers';

const router = express.Router({ mergeParams: true });

router.post('/', firebaseValidations.superAdmin, postulantCourseControllers.create);
router.get('/', firebaseValidations.superAdmin, postulantCourseControllers.getCorrectedByCourseId);
router.post(
  '/admission-test',
  firebaseValidations.superAdmin,
  postulantCourseControllers.correctTests,
);

export default router;
