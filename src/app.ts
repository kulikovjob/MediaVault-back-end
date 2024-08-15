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
import { getDatabaseConnectionUrl } from './utils/databaseUtils';
import path from 'path';
import { getDatabaseInstance } from './utils/databaseUtils';
import sessionStorage from './SessionStorage';
const app: Express = express();

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === ApplicationPhaces.Development) {
  app.use(morgan('dev'));
}

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connectionString = getDatabaseConnectionUrl(username, password);
    sessionStorage.setConnectionString(connectionString);
    const db = getDatabaseInstance(connectionString);

    const result = await db.query('SELECT 1');


    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(401).json({ message: error.message });
  }
});

app.post('/logout', (req, res) => {
  try {
    sessionStorage.clearConnectionString();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout failed:', error);

    res.status(500).json({ message: 'Logout failed. Please try again.' });
  }
});


app.use('/api/v1/media', mediaRouter);
app.use('/api/v2/', genreRouter);
app.use('/api/v3/', tagRouter);
app.use('/api/v4/', fileTypeRouter);
app.use('/api/v5/', superMetadataRouter);
app.use('/api/v6/', userRouter);
app.use('/api/v7/', viewRouter);
app.use('/api/v8/', commentRouter);
app.use('/api/v9/', metadataRouter);
app.use('/api/admin', commentRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;

