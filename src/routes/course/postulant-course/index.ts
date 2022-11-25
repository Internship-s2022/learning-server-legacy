import express from 'express';

import globalValidations from 'src/middlewares/validations';

import postulantCourseControllers from './controllers';
import postulantCourseValidations from './validations';

const router = express.Router({ mergeParams: true });

router.post('/', postulantCourseValidations.validateCreation, postulantCourseControllers.create);
router.get('/', postulantCourseControllers.getByCourseId);
router.post(
  '/admission-test',
  postulantCourseValidations.validateCorrection,
  postulantCourseControllers.correctTests,
);
router.post(
  '/promote',
  postulantCourseValidations.validatePromotion,
  postulantCourseControllers.promoteMany,
);
router.delete(
  '/:postulantId',
  globalValidations.validateMongoId,
  postulantCourseControllers.physicalDeleteByCourseId,
);
router.get('/export/csv', postulantCourseControllers.exportToCsvByCourseId);

export default router;
