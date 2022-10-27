import cors from 'cors';
import express, { Express, Response } from 'express';

import errorHandler from './middlewares/error-handler';
import router from './routes';

const app: Express = express();

router.use(errorHandler);

app.use(cors());

app.use(express.json());

app.use('/', router);

app.get('/', (_req, res: Response) => {
  res.status(200).send({
    message: 'Server is up ✅ - Environment: ' + process.env.ENV,
    data: undefined,
    error: false,
  });
});

export default app;
