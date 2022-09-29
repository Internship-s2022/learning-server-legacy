import express from 'express';

import controllers from './controllers';
import { courseValidation } from './validations';

const router = express.Router();

router.get('/', controllers.getAllCourses);
router.get('/:id', controllers.getCourseById);
router.post('/', courseValidation, controllers.createCourse);
router.put('/:id', courseValidation, controllers.editCourse);
router.patch('/:id', controllers.deleteCourse);

export default router;
