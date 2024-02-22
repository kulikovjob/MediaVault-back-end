import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import mediaRouter from './routers/mediaRouter';
import { ApplicationPhaces } from './types/types';
import { AppError } from './utils/appError';
import { errorHandler } from './controllers/errorController';

const app: Express = express();

if (process.env.NODE_ENV === ApplicationPhaces.Development) {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/media', mediaRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
