/* eslint-disable @typescript-eslint/indent */
// TODO: Delete this rule in next time when this file gonna be updated
/* eslint-disable import/prefer-default-export */

import pgPromise, { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from './catchAsync';
import { AppError } from './appError';

dotenv.config({ path: './.env' });

let instance: IDatabase<object, IClient> | null = null;

interface DBParams {
  username?: string;
  password: string;
  port?: string;
  host?: string;
  name?: string;
}

interface RequestWithAuth extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auth: any;
}

export const getDatabaseConnectionUrl = ({
  name,
  password,
  port,
  host,
  username,
}: DBParams) => `postgres://${username}:${password}@${host}:${port}/${name}?`;

export const getDatabaseInstance = ({
  name = process.env.DATABASE_NAME,
  password = process.env.DATABASE_PASSWORD,
  port = process.env.DATABASE_PORT,
  host = process.env.DATABASE_HOST,
  username = process.env.DATABASE_USERNAME,
}: DBParams): IDatabase<object, IClient> => {
  if (!instance) {
    const url = getDatabaseConnectionUrl({
      host,
      name,
      password,
      port,
      username,
    });
    instance = pgPromise()(url);
  }
  return instance;
};

export const connectToDb = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { name, password, username } = req.body;
    if (!name || !password || !username)
      return next(
        new AppError('Pleas attach password and username for auth', 401),
      );
    const connectDB = await getDatabaseInstance({ name, password, username });

    req.auth = connectDB;

    next();
  },
);
