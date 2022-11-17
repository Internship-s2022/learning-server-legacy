import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';
import globalValidations from 'src/middlewares/validations';
import moduleRouter from 'src/routes/course/module';

import coursesControllers from './controllers';
import validations from './validations';

const router = express.Router();

router.use(
  '/:courseId/module',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.courseId,
  moduleRouter,
);
router.get('/', firebaseValidations.superAdmin, coursesControllers.getAll);
router.get('/export/csv', firebaseValidations.superAdmin, coursesControllers.exportToCsv);
router.get(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.getById,
);
router.post(
  '/',
  firebaseValidations.superAdmin,
  validations.courseValidation,
  coursesControllers.create,
);
router.put(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  validations.courseValidation,
  coursesControllers.update,
);
router.patch(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.deleteById,
);
router.delete(
  '/:id',
  firebaseValidations.superAdmin,
  globalValidations.validateMongoId,
  coursesControllers.physicalDeleteById,
);

export default router;
