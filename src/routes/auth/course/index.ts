import express from 'express';

import controllers from './controllers';

const router = express.Router();

router.use('/report', controllers.getReports);
router.use('/history', controllers.getHistory);

export default router;
