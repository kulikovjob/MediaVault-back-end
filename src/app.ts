import express, {
  NextFunction,
  Request,
  Response,
  type Express,
} from 'express';
import morgan from 'morgan';
import { connectToDb } from './utils/databaseUtils';
import { ApplicationPhaces } from './types/types';
import apiRouter from './routers/apiRouter';
import { AppError } from './utils/appError';
import { errorHandler } from './controllers/errorController';

const app: Express = express();

if (process.env.NODE_ENV === ApplicationPhaces.Development) {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1', apiRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
