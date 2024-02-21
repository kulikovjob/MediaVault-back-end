import express from 'express';
import type { Express } from 'express';
import morgan from 'morgan';
import mediaRouter from './routers/mediaRouter';

const app: Express = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/media', mediaRouter);

// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

export default app;
