import express from 'express';

import controllers from './controllers';
import { courseValidation } from './validations';

const router = express.Router();

router.get('/', controllers.getAllCourses);
router.post('/', courseValidation, controllers.createCourse);
router.put('/:id', courseValidation, controllers.editCourse);

export default router;
