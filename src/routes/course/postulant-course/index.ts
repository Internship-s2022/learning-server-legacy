import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';

import postulantCourseControllers from './controllers';
import postulantCourseValidations from './validations';

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  firebaseValidations.superAdmin,
  postulantCourseValidations.validateCreation,
  postulantCourseControllers.create,
);
router.get('/', firebaseValidations.superAdmin, postulantCourseControllers.getByCourseId);
router.post(
  '/admission-test',
  firebaseValidations.superAdmin,
  postulantCourseValidations.validateCorrection,
  postulantCourseControllers.correctTests,
);
router.post(
  '/promote',
  firebaseValidations.superAdmin,
  postulantCourseValidations.validatePromotion,
  postulantCourseControllers.promoteMany,
);
router.delete(
  '/',
  firebaseValidations.superAdmin,
  postulantCourseControllers.physicalDeleteByCourseId,
);

export default router;
