import express from 'express';

import controllers from './controllers';

const router = express.Router();

router.get('/', controllers.getAllCourses);
router.post('/', controllers.createCourse);

export default router;
