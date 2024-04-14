import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import mediaRouter from './routers/mediaRouter';
import genreRouter from './routers/genreRouter';
import tagRouter from './routers/tagRouter';
import fileTypeRouter from './routers/fileTypeRouter';
import superMetadataRouter from './routers/superMetadataRouter';
import userRouter from './routers/userRouter';
import viewRouter from './routers/viewRouter';
import commentRouter from './routers/commentRouter';
import metadataRouter from './routers/metadataRouter';
import { ApplicationPhaces } from './types/types';
import { AppError } from './utils/appError';
import { errorHandler } from './controllers/errorController';


const app: Express = express();

if (process.env.NODE_ENV === ApplicationPhaces.Development) {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/media', mediaRouter);
app.use('/api/v2/', genreRouter);
app.use('/api/v3/', tagRouter);
app.use('/api/v4/', fileTypeRouter);
app.use('/api/v5/', superMetadataRouter);
app.use('/api/v6/', userRouter);
app.use('/api/v7/', viewRouter);
app.use('/api/v8/', commentRouter);
app.use('/api/v9/', metadataRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
