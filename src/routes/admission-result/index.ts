import express from 'express';

import firebaseValidations from 'src/middlewares/firebase';

import admissionResultsControllers from './controllers';

const router = express.Router();

router.get('/', firebaseValidations.superAdmin, admissionResultsControllers.getAll);

export default router;
