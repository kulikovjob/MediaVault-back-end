import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import authRouter from './routers/authRouter';
import apiRouter from './routers/apiRouter';
// import { auth, checkAuth } from './utils/authUitls';
import { AppError } from './utils/appError';

const app: Express = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1', apiRouter);

app.use('/auth', authRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app;