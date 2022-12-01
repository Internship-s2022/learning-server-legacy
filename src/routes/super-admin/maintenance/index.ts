import express from 'express';

import controllers from './controllers';

const router = express.Router();

if (process.env.ENV !== 'production') {
  router.post('/seeders', controllers.seedDatabase);
}

export default router;
